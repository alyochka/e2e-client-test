import { test } from '@japa/runner'
import BypassController from '#controllers/bypass_controller'

test.group('Bypass controller', () => {
  test('index method exists and is a function', ({ assert }) => {
    const controller = new BypassController()
    assert.isFunction(controller.index)
  })

  test('create method exists and is a function', ({ assert }) => {
    const controller = new BypassController()
    assert.isFunction(controller.create)
  })
})
