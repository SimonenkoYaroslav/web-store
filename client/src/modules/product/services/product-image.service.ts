import { StorageService } from '../../../core/storage/supabase';

class ProductImageService extends StorageService {
    protected readonly bucketId = "WebStore"

    async uploadProductImage(productId: string, file: File): Promise<{ path: string; publicUrl: string }> {
        const fileExt = file.name.split('.').pop();
        const filePath = `product-image/${productId}/temp_${Date.now()}.${fileExt}`;

        await this.uploadFile(file, filePath);

        const publicUrl = await this.getPublicUrl(filePath)
        return { path: filePath, publicUrl };
    }

    async deleteImageByPath(filePath: string): Promise<void> {
        return this.deleteFile(filePath);
    }
}

export default new ProductImageService;
