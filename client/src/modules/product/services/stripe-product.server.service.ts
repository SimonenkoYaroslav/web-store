import type Stripe from 'stripe';

import { stripe } from '@core/paymentSystem/stripe/server';
import { BillingInterval } from '@modules/product/enums/BillingInterval';
import {
    ICreateSubscriptionProductParams,
    IStripeProductReferences,
    ISyncSubscriptionPriceParams,
} from '@modules/product/types/stripeProduct';

const STRIPE_INTERVAL: Record<BillingInterval, Stripe.PriceCreateParams.Recurring['interval']> = {
    [BillingInterval.Monthly]: 'month',
    [BillingInterval.Yearly]: 'year',
};

class StripeProductService {
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

    async updateSubscriptionProduct(stripeProductId: string, name: string): Promise<void> {
        await stripe.products.update(stripeProductId, { name });
    }

    async syncSubscriptionPrice(params: ISyncSubscriptionPriceParams): Promise<string> {
        const currency = params.currency.toLowerCase();
        const unitAmount = this.toMinorUnits(params.amount);
        const targetInterval = STRIPE_INTERVAL[params.interval];

        const current = await stripe.prices.retrieve(params.stripePriceId);

        const isUnchanged =
            current.unit_amount === unitAmount &&
            current.currency === currency &&
            current.recurring?.interval === targetInterval;

        if (isUnchanged) {
            return params.stripePriceId;
        }

        const price = await stripe.prices.create({
            product: params.stripeProductId,
            currency,
            unit_amount: unitAmount,
            recurring: { interval: targetInterval },
        });

        await stripe.products.update(params.stripeProductId, { default_price: price.id });
        await stripe.prices.update(params.stripePriceId, { active: false });

        return price.id;
    }

    async archiveSubscriptionProduct(stripeProductId: string): Promise<void> {
        await stripe.products.update(stripeProductId, { active: false });
    }

    private toMinorUnits(amount: number): number {
        return Math.round(amount * 100);
    }
}

const stripeProductService = new StripeProductService;
export default stripeProductService;
