// Supported product currencies. Values are ISO 4217 codes (like ProductType,
// the value is also the stored/display text) and feed straight into Stripe via
// stripe.prices.create({ currency }) in stripe-product.server.service.ts, so they
// must stay valid Stripe currency codes — never store the symbol here.
export enum Currency {
    USD = 'USD',
    EUR = 'EUR',
    GBP = 'GBP',
}

// Display-only symbol for each currency. Used to label the currency <Select>;
// the enum value (the code) remains what gets persisted and sent to Stripe.
export const CURRENCY_SYMBOL: Record<Currency, string> = {
    [Currency.USD]: '$',
    [Currency.EUR]: '€',
    [Currency.GBP]: '£',
};
