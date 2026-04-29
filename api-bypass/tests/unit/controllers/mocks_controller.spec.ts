import { test } from '@japa/runner'
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import MocksController from '#controllers/mocks_controller'

const __dirname = dirname(fileURLToPath(import.meta.url))
const specPath = join(__dirname, '..', '..', '..', 'petstore.json')

test.group('Mocks controller', (group) => {
  const originalSpec = readFileSync(specPath, 'utf-8')

  group.setup(() => {
    writeFileSync(
      specPath,
      JSON.stringify({
        info: { title: 'Test API', version: '1.0.0' },
        openapi: '3.0.0',
        paths: {
          '/pets': {
            get: { summary: 'List pets', tags: ['Pets'], responses: {} },
          },
          '/pet': {
            post: { summary: 'Create pet', tags: ['Pets'], responses: {} },
          },
        },
      })
    )
  })

  group.teardown(() => {
    writeFileSync(specPath, originalSpec)
  })

  test('index returns handler list from petstore.json', async ({ assert }) => {
    const mockCtx = {} as any
    const controller = new MocksController()
    const result = await controller.index(mockCtx)

    assert.equal(result.message, 'MSW mock handlers generated from the OpenAPI spec')
    assert.isArray(result.handlers)
    assert.lengthOf(result.handlers, 2)
    assert.equal(result.handlers[0].method, 'GET')
    assert.equal(result.handlers[0].path, '/pets')
    assert.equal(result.handlers[0].summary, 'List pets')
    assert.equal(result.handlers[1].method, 'POST')
    assert.equal(result.handlers[1].path, '/pet')
  })
})
