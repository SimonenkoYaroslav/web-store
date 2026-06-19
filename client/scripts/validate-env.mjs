// Validates the local .env against the shared schema.
//
// Loads .env files the same way Next.js does (via @next/env) and validates them
// against the shared yup schema (src/config/env.schema.mjs). Runs standalone
// (`npm run validate:env`) and from the Husky pre-commit hook so a misconfigured
// .env is caught before commit.

import nextEnv from '@next/env'

import { envSchema } from '../src/config/env.schema.mjs'

const { loadEnvConfig } = nextEnv

// Keep @next/env quiet ("Environments: .env") but let real errors through.
loadEnvConfig(process.cwd(), true, { info() {}, warn() {}, error: console.error })

envSchema
    .validate(process.env, { abortEarly: false, stripUnknown: false })
    .then(() => {
        console.log('✓ Environment variables are valid')
    })
    .catch((error) => {
        const issues = error.errors?.length ? error.errors : [error.message]

        console.error('✗ Invalid environment configuration:\n')
        issues.forEach((issue) => console.error(`  - ${issue}`))
        console.error('\nFix the variables above in client/.env and try again.')

        process.exit(1)
    })
