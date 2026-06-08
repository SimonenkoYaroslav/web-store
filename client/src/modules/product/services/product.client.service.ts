import { createClient } from '@utils/supabase/client';
import { BUCKET_ID } from '../../../../constants/storage';
import { ICreateProduct, IProduct } from '../types';

class ProductClientService {
    async createProduct(data: ICreateProduct): Promise<void> {
        const supabase = createClient();

        const { data: createdProduct, error } = await supabase.from('products').insert({
            name: data.name,
            type: data.type,
            amount: data.amount,
            currency: data.currency,
        }).select<'products', IProduct>().single();

        if (error) {
            console.log(error);
            throw new Error(error.message);
        }
        console.log(data.image)
        console.log('Created product:', createdProduct);

        const fileExt = data.image.name.split('.').pop();
        const filePath = `product-image/${createdProduct.id}/${(createdProduct?.id ?? new Date())}-${data.image.name}.${fileExt}`;
        console.log('Uploading file to path:', filePath);
        const { error: storageError } = await supabase.storage
            .from(BUCKET_ID)
            .upload(filePath, data.image);

        if (storageError) {
            console.log(storageError)
            throw new Error(storageError.message);
        }

        const { data: { publicUrl } } = supabase.storage.from(BUCKET_ID).getPublicUrl(filePath);
        const { error: updateError, data: product } = await supabase.from('products').upsert({ ...createdProduct, image_url: publicUrl }).eq('id', createdProduct?.id).select().single();


        if (updateError) {
            throw new Error(updateError.message);
        }

        return product;
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

const productClientService = new ProductClientService;
export default productClientService;
