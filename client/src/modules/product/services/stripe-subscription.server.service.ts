import productDao from '@modules/product/dao/server';
import { ProductType } from '@modules/product/enums/ProductType';
import stripeProductService from '@modules/product/services/stripe-product.server.service';
import { IProduct } from '@modules/product/types';
import { UserRole } from '@modules/user/enums/UserRole';
import { userService } from '@modules/user/services';

class StripeSubscriptionService {
    async syncSubscription(productId: string): Promise<IProduct> {
        await this.assertAdmin();

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

    // Detaches a product from Stripe when it stops being a subscription: archives
    // the Stripe Product and clears the row's Stripe ids + billing interval. Used
    // when an edit converts a Subscription into a Single product.
    async deprovisionSubscription(productId: string): Promise<IProduct> {
        await this.assertAdmin();

        const product = await productDao.findById(productId);

        if (product.stripe_product_id) {
            await stripeProductService.archiveSubscriptionProduct(product.stripe_product_id);
        }

        return productDao.update(
            { stripe_product_id: null, stripe_price_id: null, interval: null },
            productId,
        );
    }

    // Archives the Stripe Product for a deleted local product. Pure Stripe
    // cleanup: the caller already holds the id and removes the row itself, so
    // nothing is persisted.
    async archiveSubscription(stripeProductId: string): Promise<void> {
        await this.assertAdmin();

        await stripeProductService.archiveSubscriptionProduct(stripeProductId);
    }

    private async assertAdmin(): Promise<void> {
        const user = await userService.fetchCurrentUser();

        if (user?.role !== UserRole.ADMIN) {
            throw new Error('Unauthorized');
        }
    }
}

export default new StripeSubscriptionService;
