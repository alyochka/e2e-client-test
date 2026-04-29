import { test } from '@japa/runner'
import AuthController from '#controllers/auth_controller'

test.group('Auth controller', () => {
  test('login method exists and is a function', ({ assert }) => {
    const controller = new AuthController()
    assert.isFunction(controller.login)
  })
})
