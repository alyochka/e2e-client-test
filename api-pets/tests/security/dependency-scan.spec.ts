import { execSync } from 'node:child_process'
import { resolve, dirname } from 'node:path'
import { existsSync, readdirSync } from 'node:fs'
import { test } from '@japa/runner'

function findCveLiteBinary(): string {
  const candidates: string[] = []

  try {
    const found = execSync('which cve-lite 2>/dev/null', { encoding: 'utf-8' }).trim()
    if (found) return found
  } catch {
    // ignore
  }

  const nodeDir = dirname(process.execPath)
  candidates.push(`${nodeDir}/cve-lite`)

  try {
    const globalPrefix = execSync('npm config get prefix 2>/dev/null', { encoding: 'utf-8' }).trim()
    if (globalPrefix) candidates.push(`${globalPrefix}/bin/cve-lite`)
  } catch {
    // ignore
  }

  const home = process.env.HOME ?? ''
  const searchDirs = [
    `${home}/.local/share/mise/installs/node`,
    `${home}/.nvm/versions/node`,
    `${home}/.volta/tools/node`,
  ]
  for (const base of searchDirs) {
    if (!existsSync(base)) continue
    try {
      for (const version of readdirSync(base)) {
        const p = `${base}/${version}/bin/cve-lite`
        if (existsSync(p)) candidates.push(p)
      }
    } catch {
      // ignore
    }
  }

  for (const c of candidates) {
    if (existsSync(c)) return c
  }

  throw new Error('cve-lite binary not found. Install with: npm i -g cve-lite-cli')
}

test.group('Dependency CVE Scan', () => {
  test('should have no critical vulnerabilities', async ({ assert }) => {
    const projectDir = resolve(import.meta.dirname, '../..')
    const cveLitePath = findCveLiteBinary()

    let raw: string
    try {
      raw = execSync(
        `${cveLitePath} . --json --no-open --fail-on critical --usage`,
        { cwd: projectDir, encoding: 'utf-8', timeout: 120_000 }
      )
    } catch (err: any) {
      // cve-lite exits non-zero when vulns >= fail-on threshold; capture output anyway
      raw = err.stdout ?? err.message ?? ''
    }

    const jsonStart = raw.indexOf('{')
    const jsonEnd = raw.lastIndexOf('}') + 1
    if (jsonStart < 0 || jsonEnd <= jsonStart) {
      assert.fail(`Could not parse cve-lite output: ${raw.slice(0, 200)}`)
      return
    }

    const json = raw.slice(jsonStart, jsonEnd)
    const result = JSON.parse(json)

    const findings: Array<{
      package: string
      version: string
      severity: string
      cves: string[]
      firstFixedVersion: string
      relationship: string
    }> = result.findings ?? []

    if (findings.length > 0) {
      const rows = findings.map(
        (f) =>
          `  ${f.severity.toUpperCase().padEnd(8)} | ${f.package}@${f.version} (${f.relationship}) | CVEs: ${f.cves.join(', ')} | Fix: ${f.firstFixedVersion}`
      )
      console.log('\n  Findings:')
      console.log(rows.join('\n'))
    }

    const critical = findings.filter((f) => f.severity === 'critical')
    assert.isEmpty(critical, `Found ${critical.length} CRITICAL vulnerabilities: ${critical.map((f) => `${f.package}@${f.version} (${f.cves.join(', ')})`).join('; ')}`)
  })
})
