import { test } from '@japa/runner'

test.group('Routes', () => {
  test('GET / returns It works', async ({ client }) => {
    const response = await client.get('/')
    response.assertStatus(200)
    response.assertTextIncludes('It works!')
  })

  test('GET /mocks returns handler list', async ({ client, assert }) => {
    const response = await client.get('/mocks')
    response.assertStatus(200)

    const body = response.body()
    assert.equal(body.message, 'MSW mock handlers generated from the OpenAPI spec')
    assert.isArray(body.handlers)
    assert.isString(body.note)
  })
})
