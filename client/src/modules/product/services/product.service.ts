import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

import { createClient } from '@utils/supabase/client';

import { BUCKET_ID } from '../../../../constants/storage';
import { productDao } from '../dao';
import { ICreateProduct, IProduct, IUpdateProduct } from '../types';

class ProductService {
    async createProduct(data: Omit<ICreateProduct, 'image'>): Promise<IProduct> {
        const supabase = createClient();

        return productDao.insert(supabase, data);
    }

    async updateProduct(productId: string, data: IUpdateProduct): Promise<void> {
        const supabase = createClient();

        await productDao.update(supabase, productId, data);
    }

    async deleteProduct(productId: string): Promise<void> {
        const supabase = createClient();

        const folderPath = `product-image/${productId}`;

        const { data: files, error: listError } = await supabase.storage
            .from(BUCKET_ID)
            .list(folderPath);

        if (listError) {
            throw new Error(listError.message);
        }

        if (files && files.length > 0) {
            const filePaths = files.map((file) => `${folderPath}/${file.name}`);

            const { error: removeError } = await supabase.storage
                .from(BUCKET_ID)
                .remove(filePaths);

            if (removeError) {
                throw new Error(removeError.message);
            }
        }

        await productDao.delete(supabase, productId);
    }

    // Subscribes to live row changes on the products table via Supabase Realtime
    // and returns an unsubscribe function. Listening to every event (not just
    // INSERT) is required because product creation is multi-step — the row is
    // inserted with an empty image_url, then UPDATEd once the image upload and
    // any Stripe provisioning finish — so consumers stay in sync as the row
    // settles. Delivery is still bounded by the table's RLS select policy.
    //
    // The table must belong to the supabase_realtime publication for events to
    // arrive (see the 20260622130000_products_realtime.sql migration).
    subscribeToChanges(
        onChange: (payload: RealtimePostgresChangesPayload<IProduct>) => void,
    ): () => void {
        const supabase = createClient();

        const channel = supabase
            .channel('public:products')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, onChange)
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }
}

const productService = new ProductService;
export default productService;
