import { writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const apiUrl = process.env.API_PETS_URL ?? 'http://localhost:3333'

console.log(`Fetching OpenAPI spec from ${apiUrl}/api ...`)

const res = await fetch(`${apiUrl}/api`)
if (!res.ok) {
  throw new Error(`Failed to fetch OpenAPI spec: ${res.status} ${res.statusText}`)
}

const spec = await res.json()
const outputPath = join(__dirname, '..', 'petstore.json')
writeFileSync(outputPath, JSON.stringify(spec, null, 2))

console.log(`OpenAPI spec saved to ${outputPath}`)
