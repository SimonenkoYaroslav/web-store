import { BillingInterval } from '@modules/product/enums/BillingInterval';

export interface ICreateSubscriptionProductParams {
    name: string;
    amount: number;
    currency: string;
    interval: BillingInterval;
}

export interface IStripeProductReferences {
    stripeProductId: string;
    stripePriceId: string;
}

export interface ISyncSubscriptionPriceParams {
    stripeProductId: string;
    stripePriceId: string;
    amount: number;
    currency: string;
    interval: BillingInterval;
}
