// Verifies .env.example documents every variable the env schema requires, so the
// committed example never drifts from what the app actually needs. Uses no real
// values, so it is safe to run in CI.

import { readFileSync } from 'node:fs'

import { envKeys } from '../src/config/env.schema.mjs'

const EXAMPLE_PATH = '.env.example'

let content

try {
    content = readFileSync(EXAMPLE_PATH, 'utf8')
} catch {
    console.error(`✗ ${EXAMPLE_PATH} is missing. Create it with every required variable.`)

    process.exit(1)
}

const declaredKeys = new Set(
    content
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith('#'))
        .map((line) => line.split('=')[0].trim())
        .filter(Boolean),
)

const missing = envKeys.filter((key) => !declaredKeys.has(key))

if (missing.length > 0) {
    console.error(`✗ ${EXAMPLE_PATH} is out of sync with the env schema. Missing:\n`)
    missing.forEach((key) => console.error(`  - ${key}`))
    console.error(`\nAdd the variables above to ${EXAMPLE_PATH}.`)

    process.exit(1)
}

console.log(`✓ ${EXAMPLE_PATH} covers all ${envKeys.length} required variables`)
