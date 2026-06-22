'use server'

import { ProductType } from '@modules/product/enums/ProductType';
import productServerService from '@modules/product/services/product.server.service';
import stripeProductService from '@modules/product/services/stripe-product.server.service';

// Server Action: provisions the Stripe side of a subscription product once the
// product row exists. Called from the client create flow (createProduct util)
// after the row + image are in place. It re-reads the product server-side, so it
// trusts the database rather than client-supplied amount/currency/interval.
//
// No-ops for non-subscription products and for rows already provisioned, so it
// is safe to call unconditionally / retry.
export async function createStripeSubscription(productId: string): Promise<void> {
    const product = await productServerService.fetchProductById(productId);

    if (product.type !== ProductType.Subscription || product.stripe_product_id) {
        return;
    }

    if (!product.interval) {
        throw new Error('Subscription product is missing a billing interval');
    }

    const { stripeProductId, stripePriceId } = await stripeProductService.createSubscriptionProduct({
        name: product.name,
        amount: product.amount,
        currency: product.currency,
        interval: product.interval,
    });

    await productServerService.setStripeReferences(productId, stripeProductId, stripePriceId);
}
