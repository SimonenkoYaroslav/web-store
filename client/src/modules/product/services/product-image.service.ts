import { createClient } from '@core/clients/supabase/client';
import { StorageService } from '@core/storage/supabase';

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

    async deleteImageByUrl(imageUrl: string): Promise<void> {
        return this.deleteFile(this.getPathFromUrl(imageUrl));
    }

    private getPathFromUrl(imageUrl: string): string {
        const marker = `/public/${this.bucketId}/`;
        const markerIndex = imageUrl.indexOf(marker);

        return markerIndex === -1 ? imageUrl : imageUrl.slice(markerIndex + marker.length);
    }
}

export default new ProductImageService(createClient);
