'use server';

import productDao from '@modules/product/dao/server';
import { ProductType } from '@modules/product/enums/ProductType';
import stripeProductService from '@modules/product/services/stripe-product.server.service';
import { IProduct } from '@modules/product/types';
import { UserRole } from '@modules/user/enums/UserRole';
import { userService } from '@modules/user/services';

// The server-side bridge between local product management (which runs in the
// browser via the client productService) and Stripe (whose SDK is server-only).
//
// SECURITY: Server Actions are reachable via direct POST regardless of the UI, so
// each entry point re-verifies the caller is an authenticated admin server-side —
// the client-side admin route guard does not protect these endpoints.
async function assertAdmin(): Promise<void> {
    const user = await userService.fetchCurrentUser();

    if (user?.role !== UserRole.ADMIN) {
        throw new Error('Unauthorized');
    }
}

// Reconciles a subscription product's Stripe representation with its current row.
// Idempotent: provisions the Stripe Product + recurring Price the first time (used
// by create), and on later calls updates the name and re-prices when amount/
// currency changed (used by edit). Persists any new Stripe ids via the server DAO.
export async function syncStripeSubscription(productId: string): Promise<IProduct> {
    await assertAdmin();

    const product = await productDao.findById(productId);

    if (product.type !== ProductType.Subscription) {
        return product;
    }

    const { name, amount, currency, interval, stripe_product_id, stripe_price_id } = product;

    if (interval === null) {
        throw new Error('A subscription product must have a billing interval.');
    }

    if (!stripe_product_id || !stripe_price_id) {
        const references = await stripeProductService.createSubscriptionProduct({ name, amount, currency, interval });

        return productDao.update(
            { stripe_product_id: references.stripeProductId, stripe_price_id: references.stripePriceId },
            productId,
        );
    }

    await stripeProductService.updateSubscriptionProduct(stripe_product_id, name);

    const syncedPriceId = await stripeProductService.syncSubscriptionPrice({
        stripeProductId: stripe_product_id,
        stripePriceId: stripe_price_id,
        amount,
        currency,
        interval,
    });

    if (syncedPriceId !== stripe_price_id) {
        return productDao.update({ stripe_price_id: syncedPriceId }, productId);
    }

    return product;
}

// Detaches a product from Stripe when it stops being a subscription: archives the
// Stripe Product and clears the row's Stripe ids + billing interval. Used when an
// edit converts a Subscription into a Single product.
export async function deprovisionStripeSubscription(productId: string): Promise<IProduct> {
    await assertAdmin();

    const product = await productDao.findById(productId);

    if (product.stripe_product_id) {
        await stripeProductService.archiveSubscriptionProduct(product.stripe_product_id);
    }

    return productDao.update(
        { stripe_product_id: null, stripe_price_id: null, interval: null },
        productId,
    );
}

// Archives the Stripe Product for a deleted local product. Pure Stripe cleanup: the
// caller already holds the id and removes the row itself, so nothing is persisted.
export async function archiveStripeSubscription(stripeProductId: string): Promise<void> {
    await assertAdmin();

    await stripeProductService.archiveSubscriptionProduct(stripeProductId);
}
