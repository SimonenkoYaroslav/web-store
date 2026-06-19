import { createClient } from '@utils/supabase/client';

import { BUCKET_ID } from '../../../../constants/storage';

class ProductClientService {
    async uploadProductImage(productId: string, file: File): Promise<{ path: string; publicUrl: string }> {
        const supabase = createClient();
        const fileExt = file.name.split('.').pop();
        const filePath = `product-image/${productId}/temp_${Date.now()}.${fileExt}`;

        const { error } = await supabase.storage.from(BUCKET_ID).upload(filePath, file);

        if (error) {throw new Error(error.message);}

        const { data: { publicUrl } } = supabase.storage.from(BUCKET_ID).getPublicUrl(filePath);
        return { path: filePath, publicUrl };
    }

    async deleteImageByPath(filePath: string): Promise<void> {
        const supabase = createClient();
        const { error } = await supabase.storage.from(BUCKET_ID).remove([filePath]);

        if (error) {throw new Error(error.message);}
    }

    async deleteProductImagesExcept(productId: string, keepPath: string): Promise<void> {
        const supabase = createClient();
        const folderPath = `product-image/${productId}`;
        const { data: files, error: listError } = await supabase.storage.from(BUCKET_ID).list(folderPath);

        if (listError) {throw new Error(listError.message);}

        if (files && files.length > 0) {
            const toDelete = files
                .map((file) => `${folderPath}/${file.name}`)
                .filter((path) => path !== keepPath);

            if (toDelete.length > 0) {
                const { error } = await supabase.storage.from(BUCKET_ID).remove(toDelete);

                if (error) {throw new Error(error.message);}
            }
        }
    }

    async deleteProductImages(productId: string) {
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
    }
}

const productClientService = new ProductClientService;
export default productClientService;
