import { test } from '@japa/runner'
import Pet from '#models/pet'
import Session from '#models/session'
import User from '#models/user'
import crypto from 'node:crypto'
import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from '#tests/helpers/test_user'

test.group('Pets controller', (group) => {
  let token: string

  group.each.setup(async () => {
    const user = await User.firstOrCreate({ email: TEST_USER_EMAIL }, { fullName: 'Test User', email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD })
    token = crypto.randomBytes(32).toString('hex')
    await Session.create({ userId: user.id, token, name: 'test-session' })
  })

  group.each.teardown(async () => {
    await Session.query().delete()
    await Pet.query().delete()
    await User.query().delete()
  })

  test('GET /pets returns paginated empty list', async ({ client, assert }) => {
    const response = await client.get('/pets')

    response.assertStatus(200)
    assert.isArray(response.body().data)
    assert.lengthOf(response.body().data, 0)
    assert.equal(response.body().meta.page, 1)
    assert.equal(response.body().meta.perPage, 10)
    assert.equal(response.body().meta.total, 0)
  })

  test('GET /pets respects pagination params', async ({ client, assert }) => {
    await Pet.createMany([
      { nome: 'Shibo', raca: 'Pug', idade: 6, status: 'available' },
      { nome: 'Rex', raca: 'Labrador', idade: 3, status: 'available' },
      { nome: 'Mimi', raca: 'Siamese', idade: 2, status: 'pending' },
    ])

    const response = await client.get('/pets').qs({ page: 1, perPage: 2 })

    response.assertStatus(200)
    assert.lengthOf(response.body().data, 2)
    assert.equal(response.body().meta.page, 1)
    assert.equal(response.body().meta.perPage, 2)
    assert.equal(response.body().meta.total, 3)
  })

  test('GET /pets returns pets with all fields', async ({ client, assert }) => {
    await Pet.create({
      nome: 'Shibo',
      raca: 'Pug',
      idade: 6,
      status: 'available',
      ownerName: 'John',
      ownerEmail: 'john@example.com',
      tags: ['friendly', 'vaccinated'],
      notes: 'Needs grooming',
    })

    const response = await client.get('/pets')

    response.assertStatus(200)
    const pet = response.body().data[0]
    assert.equal(pet.nome, 'Shibo')
    assert.equal(pet.raca, 'Pug')
    assert.equal(pet.idade, 6)
    assert.equal(pet.status, 'available')
    assert.equal(pet.ownerName, 'John')
    assert.equal(pet.ownerEmail, 'john@example.com')
    assert.deepEqual(pet.tags, ['friendly', 'vaccinated'])
    assert.equal(pet.notes, 'Needs grooming')
  })

  test('POST /pet without auth returns 401', async ({ client }) => {
    const response = await client
      .post('/pet')
      .json({ nome: 'Shibo', raca: 'Pug', idade: 6 })

    response.assertStatus(401)
  })

  test('POST /pet with valid Bearer token creates pet', async ({ client, assert }) => {
    const response = await client
      .post('/pet')
      .json({
        nome: 'Shibo',
        raca: 'Pug',
        idade: 6,
        status: 'available',
        ownerName: 'John',
        ownerEmail: 'john@example.com',
        tags: ['friendly'],
        notes: 'Cute pug',
      })
      .header('authorization', `Bearer ${token}`)

    response.assertStatus(200)
    assert.equal(response.body().nome, 'Shibo')
    assert.equal(response.body().raca, 'Pug')
    assert.equal(response.body().idade, 6)
    assert.isNumber(response.body().id)
  })

  test('POST /pet with invalid Bearer token returns 401', async ({ client }) => {
    const response = await client
      .post('/pet')
      .json({ nome: 'Shibo', raca: 'Pug', idade: 6 })
      .header('authorization', 'Bearer invalid-token-123')

    response.assertStatus(401)
  })

  test('POST /pet with missing fields returns 422', async ({ client }) => {
    const response = await client
      .post('/pet')
      .json({ nome: 'Shibo' })
      .header('authorization', `Bearer ${token}`)

    response.assertStatus(422)
  })

  test('POST /pet with negative idade returns 422', async ({ client }) => {
    const response = await client
      .post('/pet')
      .json({ nome: 'Shibo', raca: 'Pug', idade: -1 })
      .header('authorization', `Bearer ${token}`)

    response.assertStatus(422)
  })
})
