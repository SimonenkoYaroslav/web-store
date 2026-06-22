import { createClient as createServer } from '@utils/supabase/server';

import { productDao } from '../dao';
import { IProduct } from '../types';

class ProductServerService {
    async fetchProducts(): Promise<IProduct[]> {
        const supabase = await createServer();

        return productDao.findAll(supabase);
    }

    async fetchProductById(productId: string): Promise<IProduct> {
        const supabase = await createServer();

        return productDao.findById(supabase, productId);
    }

    async setStripeReferences(
        productId: string,
        stripeProductId: string,
        stripePriceId: string,
    ): Promise<void> {
        const supabase = await createServer();

        await productDao.setStripeReferences(supabase, productId, stripeProductId, stripePriceId);
    }
}

const productServerService = new ProductServerService;
export default productServerService;
