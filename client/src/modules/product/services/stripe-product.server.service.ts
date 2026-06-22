import type Stripe from 'stripe';

import { stripe } from '@core/stripe/server';

import { BillingInterval } from '../enums/BillingInterval';

interface ICreateSubscriptionProductParams {
    name: string;
    amount: number;
    currency: string;
    interval: BillingInterval;
}

interface IStripeProductReferences {
    stripeProductId: string;
    stripePriceId: string;
}

// Maps our BillingInterval enum to Stripe's recurring interval wire values,
// keeping the rest of the app decoupled from Stripe's vocabulary.
const STRIPE_INTERVAL: Record<BillingInterval, Stripe.PriceCreateParams.Recurring['interval']> = {
    [BillingInterval.Monthly]: 'month',
    [BillingInterval.Yearly]: 'year',
};

// Server-only base layer for managing the Stripe side of subscription products.
// Pure Stripe operations: it never touches Supabase — callers (e.g. the
// createStripeSubscription action) persist the returned ids. Import by full path
// from Server Components / Route Handlers / actions only (it pulls in the
// server-only Stripe client via @core/stripe/server).
class StripeProductService {
    // Creates a Stripe Product and a recurring Price for it, returning both ids.
    async createSubscriptionProduct(
        params: ICreateSubscriptionProductParams,
    ): Promise<IStripeProductReferences> {
        const product = await stripe.products.create({ name: params.name });

        const price = await stripe.prices.create({
            product: product.id,
            currency: params.currency.toLowerCase(),
            unit_amount: this.toMinorUnits(params.amount),
            recurring: { interval: STRIPE_INTERVAL[params.interval] },
        });

        return { stripeProductId: product.id, stripePriceId: price.id };
    }

    // Updates mutable Product fields. Prices are immutable in Stripe, so changing
    // amount/currency/interval means creating a new Price and re-pointing the
    // product row at it — out of scope for this base layer.
    async updateSubscriptionProduct(stripeProductId: string, name: string): Promise<void> {
        await stripe.products.update(stripeProductId, { name });
    }

    // Soft-deletes by deactivating the Product (Stripe products cannot be hard
    // deleted once they have a price). Use this when the local product is removed.
    async archiveSubscriptionProduct(stripeProductId: string): Promise<void> {
        await stripe.products.update(stripeProductId, { active: false });
    }

    // Stripe expects amounts in the currency's minor unit (e.g. cents). This
    // assumes a 2-decimal currency; zero-decimal currencies (JPY, etc.) are not
    // yet handled.
    private toMinorUnits(amount: number): number {
        return Math.round(amount * 100);
    }
}

const stripeProductService = new StripeProductService;
export default stripeProductService;
