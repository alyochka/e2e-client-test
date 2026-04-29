import { HttpContext } from '@adonisjs/core/http'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default class MocksController {
  async index({}: HttpContext) {
    const specPath = join(__dirname, '..', '..', 'petstore.json')
    const spec = JSON.parse(readFileSync(specPath, 'utf-8'))

    const handlers: { method: string; path: string; summary?: string }[] = []

    for (const [path, methods] of Object.entries(spec.paths)) {
      for (const [method, operation] of Object.entries(methods as Record<string, Record<string, unknown>>)) {
        if (['get', 'post', 'put', 'patch', 'delete'].includes(method)) {
          handlers.push({
            method: method.toUpperCase(),
            path,
            summary: (operation as Record<string, string>).summary,
          })
        }
      }
    }

    return {
      message: 'MSW mock handlers generated from the OpenAPI spec',
      handlers,
      note: 'Use these handlers in your tests or development environment',
    }
  }
}
