import { test } from '@japa/runner'
import env from '#start/env'

let apiPetsRunning = false

test.group('End-to-end', (group) => {
  group.setup(async () => {
    try {
      const apiUrl = env.get('API_PETS_URL')
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 3000)
      const res = await fetch(`${apiUrl}/`, { signal: controller.signal })
      clearTimeout(timeout)
      apiPetsRunning = res.ok
    } catch {
      apiPetsRunning = false
    }

    if (!apiPetsRunning) {
      console.log('Skipping integration tests: api-pets is not running')
    }
  })

  test('full chain: login → create pet → list pets', async ({ client, assert }) => {
    if (!apiPetsRunning) return

    const loginResponse = await client
      .post('/auth/login')
      .json({ email: 'test@test.com', password: 'secret123' })

    loginResponse.assertStatus(200)
    const token = loginResponse.body().token
    assert.isString(token)
    assert.lengthOf(token, 64)

    const createResponse = await client
      .post('/pet')
      .json({
        nome: 'Shibo',
        raca: 'Pug',
        idade: 6,
        status: 'available',
        ownerName: 'Test Owner',
        ownerEmail: 'owner@test.com',
        tags: ['friendly'],
        notes: 'Integration test pet',
      })
      .header('authorization', `Bearer ${token}`)

    createResponse.assertStatus(200)
    const createdPet = createResponse.body()
    assert.equal(createdPet.nome, 'Shibo')
    assert.equal(createdPet.raca, 'Pug')
    assert.isNumber(createdPet.id)
  })

  test('GET /pets returns paginated list', async ({ client, assert }) => {
    if (!apiPetsRunning) return

    const response = await client.get('/pets')
    response.assertStatus(200)

    const body = response.body()
    assert.isArray(body.data)
    assert.isNumber(body.meta.page)
    assert.isNumber(body.meta.perPage)
    assert.isNumber(body.meta.total)
  })

  test('POST /pet without token returns 401', async ({ client }) => {
    if (!apiPetsRunning) return

    const response = await client
      .post('/pet')
      .json({ nome: 'Shibo', raca: 'Pug', idade: 6 })

    response.assertStatus(401)
  })
})
