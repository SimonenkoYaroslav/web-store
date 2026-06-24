// Shared environment schema — the single source of truth for which variables the
// app requires and how they are validated. Consumed by:
//   - src/config/env.ts             (typed, validated runtime access — @config)
//   - scripts/validate-env.mjs      (pre-commit: validate the local .env)
//   - scripts/check-env-example.mjs (pre-commit/CI: keep .env.example in sync)
//
// Plain ESM (not TS) on purpose: the scripts run under plain Node with no TS
// runner installed, and TS app code can still import it. Only variables the code
// actually reads belong here, so validation never blocks on unused config — add a
// field (and the matching one in env.ts's IEnv) when new code needs a new var.

import { object, string } from 'yup'

export const envSchema = object({
    NEXT_PUBLIC_SUPABASE_URL: string()
        .url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL')
        .required('NEXT_PUBLIC_SUPABASE_URL is required'),
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: string()
        .required('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is required'),
    STRIPE_SECRET_KEY: string()
        .required('STRIPE_SECRET_KEY is required'),
})

export const envKeys = Object.keys(envSchema.fields)
