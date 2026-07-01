import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

import { createClient } from '@core/clients/supabase/client';
import productDao from '@modules/product/dao/client'
import { ICreateProduct, IProduct } from '@modules/product/types';
import { IUpdateProductInput } from '@modules/product/types/updateProduct';

import productImageService from './product-image.service';

class ProductService {
    async createProduct(data: ICreateProduct): Promise<IProduct> {
        const { image, ...productData } = data;
        const [file] = image;

        const createdProduct = await productDao.insert(productData);
        const { publicUrl } = await productImageService.uploadProductImage(createdProduct.id, file);

        return this.updateProduct({ productId: createdProduct.id, data: { imageUrl: publicUrl } });
    }

    async updateProduct(params: IUpdateProductInput): Promise<IProduct> {
        const { data, productId } = params;
        const { imageUrl, ...rest } = data;

        await this.assumeUpdatedImage(productId, imageUrl);

        const payload = imageUrl === undefined ? rest : { ...rest, image_url: imageUrl };
        return productDao.update(payload, productId);
    }

    async deleteProduct(productId: string): Promise<void> {
        await productDao.delete(productId);
    }

    private async assumeUpdatedImage(productId: string, imageUrl?: string): Promise<void> {
        const product = await productDao.findById(productId);
        const isImageReplaced = Boolean(product.image_url) && product.image_url !== imageUrl;

        if (isImageReplaced) {
            await productImageService.deleteImageByPath(product.image_url);
        }
    }

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

export default new ProductService;
