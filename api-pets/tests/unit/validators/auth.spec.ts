import { test } from '@japa/runner'
import { loginValidator } from '#validators/auth'

test.group('Auth validator', () => {
  test('validates correct credentials', async ({ assert }) => {
    const data = { email: 'test@test.com', password: 'secret123' }
    const result = await loginValidator.validate(data)
    assert.equal(result.email, 'test@test.com')
    assert.equal(result.password, 'secret123')
  })

  test('rejects invalid email format', async ({ assert }) => {
    const data = { email: 'not-an-email', password: 'secret123' }

    try {
      await loginValidator.validate(data)
      assert.fail('Expected validation error')
    } catch (error: any) {
      assert.include(error.messages[0].field, 'email')
    }
  })

  test('rejects password shorter than 6 characters', async ({ assert }) => {
    const data = { email: 'test@test.com', password: '12345' }

    try {
      await loginValidator.validate(data)
      assert.fail('Expected validation error')
    } catch (error: any) {
      assert.include(error.messages[0].field, 'password')
    }
  })

  test('rejects missing email', async ({ assert }) => {
    const data = { password: 'secret123' }

    try {
      await loginValidator.validate(data)
      assert.fail('Expected validation error')
    } catch (error: any) {
      assert.include(error.messages[0].field, 'email')
    }
  })

  test('rejects missing password', async ({ assert }) => {
    const data = { email: 'test@test.com' }

    try {
      await loginValidator.validate(data)
      assert.fail('Expected validation error')
    } catch (error: any) {
      assert.include(error.messages[0].field, 'password')
    }
  })
})
