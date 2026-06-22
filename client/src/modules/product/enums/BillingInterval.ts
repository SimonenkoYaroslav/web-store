// Recurring billing cadence for Subscription products. Values match the display
// text (like ProductType) and the public."BillingInterval" Postgres enum; the
// Stripe wire values ('month' | 'year') are mapped from these in
// stripe-product.server.service.ts so this enum stays decoupled from Stripe.
export enum BillingInterval {
    Monthly = 'Monthly',
    Yearly = 'Yearly',
}
