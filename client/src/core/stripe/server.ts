import Stripe from 'stripe'

import { env } from '@config'

// Server-only Stripe client. The secret SDK is stateless, so a single shared
// instance is reused across requests (unlike the per-request Supabase clients).
// Import only from Server Components, Route Handlers, or *.server.service.ts.
// STRIPE_SECRET_KEY presence is guaranteed by the validated env module.
export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: '2026-05-27.dahlia',
    typescript: true,
    appInfo: {
        name: 'web-store',
    },
})
