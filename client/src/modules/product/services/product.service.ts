import { createClient } from '@utils/supabase/client';
import { ICreateProduct, IProduct, IUpdateProduct } from '../types';
import { BUCKET_ID } from '../../../../constants/storage';

class ProductService {
    async createProduct(data: Omit<ICreateProduct, 'image'>): Promise<IProduct> {
        const supabase = createClient();
        const { error, data: createdProduct } = await supabase.from('products').insert({
            name: data.name,
            type: data.type,
            amount: data.amount,
            currency: data.currency,
        }).select<"*", IProduct>("*").single();

        if (error) throw new Error(error.message);

        return createdProduct;
    }

    async updateProduct(productId: string, data: IUpdateProduct): Promise<void> {
        const supabase = createClient();
        const { error } = await supabase.from('products').update({
            name: data.name,
            type: data.type,
            amount: data.amount,
            currency: data.currency,
            ...(data.imageUrl && { image_url: data.imageUrl }),
        }).eq('id', productId);
        if (error) throw new Error(error.message);
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

        const { error } = await supabase.from('products').delete().eq('id', productId);

        if (error) {
            throw new Error(error.message);
        }
    }
}

const productService = new ProductService;
export default productService;
