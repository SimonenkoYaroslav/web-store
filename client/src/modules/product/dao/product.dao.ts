import type { SupabaseClient } from '@supabase/supabase-js';

import { AbstractDao } from '@core/dao/AbstractDao';

import { ProductType } from '../enums/ProductType';
import { ICreateProduct, IProduct, IUpdateProduct } from '../types';

// Data Access Object for the `products` table. Owns every query against that
// table (column mapping, ordering, filters) so services orchestrate behaviour
// without knowing the storage schema. Storage-bucket cleanup is NOT a DAO
// concern — it stays in the product services.
class ProductDao extends AbstractDao {
    protected readonly table = 'products';

    async insert(client: SupabaseClient, data: Omit<ICreateProduct, 'image'>): Promise<IProduct> {
        return this.unwrap(
            await client.from(this.table).insert({
                name: data.name,
                type: data.type,
                amount: data.amount,
                currency: data.currency,
                interval: data.type === ProductType.Subscription ? data.interval ?? null : null,
            }).select<'*', IProduct>('*').single(),
        );
    }

    async update(client: SupabaseClient, productId: string, data: IUpdateProduct): Promise<void> {
        this.unwrap(
            await client.from(this.table).update({
                name: data.name,
                type: data.type,
                amount: data.amount,
                currency: data.currency,
                ...(data.imageUrl && { image_url: data.imageUrl }),
            }).eq('id', productId),
        );
    }

    async delete(client: SupabaseClient, productId: string): Promise<void> {
        this.unwrap(await client.from(this.table).delete().eq('id', productId));
    }

    async findAll(client: SupabaseClient): Promise<IProduct[]> {
        return this.unwrap(
            await client.from(this.table).select<'*', IProduct>('*').order('created_at', { ascending: false }),
        );
    }

    async findById(client: SupabaseClient, productId: string): Promise<IProduct> {
        return this.unwrap(
            await client.from(this.table).select<'*', IProduct>('*').eq('id', productId).single(),
        );
    }

    async setStripeReferences(
        client: SupabaseClient,
        productId: string,
        stripeProductId: string,
        stripePriceId: string,
    ): Promise<void> {
        this.unwrap(
            await client.from(this.table).update({
                stripe_product_id: stripeProductId,
                stripe_price_id: stripePriceId,
            }).eq('id', productId),
        );
    }
}

const productDao = new ProductDao;
export default productDao;
