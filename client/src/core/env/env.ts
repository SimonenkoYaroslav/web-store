import { ValidationError } from 'yup'

import { envSchema } from './env.schema.mjs'

// Keep in sync with env.schema.mjs — the schema validates at runtime, this types
// the result. Both must list the same variables.
export interface IEnv {
    NEXT_PUBLIC_SUPABASE_URL: string
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: string
    STRIPE_SECRET_KEY: string
}

// Server-only. Validates the required environment variables once, at first import
// on the server, and exposes them typed and guaranteed-present. Do NOT import this
// from a Client Component: server-only secrets (STRIPE_SECRET_KEY) are undefined
// in the browser bundle and validation would throw. In client code read the
// NEXT_PUBLIC_* values from process.env directly.
let validatedEnv: IEnv

try {
    validatedEnv = envSchema.validateSync(process.env, {
        abortEarly: false,
        stripUnknown: true,
    }) as IEnv
} catch (error) {
    const issues = error instanceof ValidationError ? error.errors : [String(error)]

    throw new Error(`Invalid environment configuration:\n  - ${issues.join('\n  - ')}`)
}

export const env = validatedEnv
