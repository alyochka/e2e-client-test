import { test } from '@japa/runner'
import User from '#models/user'
import { TEST_USER_EMAIL, TEST_USER_PASSWORD } from '#tests/helpers/test_user'

test.group('Auth controller', (group) => {
  group.each.setup(async () => {
    await User.firstOrCreate({ email: TEST_USER_EMAIL }, { fullName: 'Test User', email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD })
  })

  group.each.teardown(async () => {
    await User.query().delete()
  })

  test('login with valid credentials returns token and user', async ({ client, assert }) => {
    const response = await client
      .post('/auth/login')
      .json({ email: TEST_USER_EMAIL, password: TEST_USER_PASSWORD })

    response.assertStatus(200)
    response.assertBodyContains({
      user: { email: TEST_USER_EMAIL, fullName: 'Test User' },
    })
    assert.isString(response.body().token)
  })

  test('login with invalid password returns 401', async ({ client }) => {
    const response = await client
      .post('/auth/login')
      .json({ email: TEST_USER_EMAIL, password: 'wrongpassword' })

    response.assertStatus(401)
  })

  test('login with non-existent email returns 401', async ({ client }) => {
    const response = await client
      .post('/auth/login')
      .json({ email: 'nonexistent@test.com', password: TEST_USER_PASSWORD })

    response.assertStatus(401)
  })

  test('login with missing fields returns 422', async ({ client }) => {
    const response = await client
      .post('/auth/login')
      .json({ email: TEST_USER_EMAIL })

    response.assertStatus(422)
  })

  test('login with invalid email format returns 422', async ({ client }) => {
    const response = await client
      .post('/auth/login')
      .json({ email: 'not-an-email', password: TEST_USER_PASSWORD })

    response.assertStatus(422)
  })

  test('login with short password returns 422', async ({ client }) => {
    const response = await client
      .post('/auth/login')
      .json({ email: TEST_USER_EMAIL, password: '123' })

    response.assertStatus(422)
  })
})
