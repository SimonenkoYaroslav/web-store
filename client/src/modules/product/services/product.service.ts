import productDao from '@modules/product/dao/client'
import { ProductType } from '@modules/product/enums/ProductType';
import { ICreateProduct, IEditProduct, IProduct } from '@modules/product/types';
import { IUpdateProductInput } from '@modules/product/types/updateProduct';

import productImageService from './product-image.service';

class ProductService {
    async createProduct(data: ICreateProduct): Promise<IProduct> {
        const { image, ...productData } = data;
        const [file] = image;

        const createdProduct = await productDao.insert(productData);

        let imagePath: string | undefined;

        try {
            const { path, publicUrl } = await productImageService.uploadProductImage(createdProduct.id, file);
            imagePath = path;

            const product = await this.updateProduct({ productId: createdProduct.id, data: { imageUrl: publicUrl } });

            return product;

        } catch (error) {
            await this.rollbackCreate(createdProduct.id, imagePath);
            throw error;
        }
    }

    async editProduct(productId: string, data: IEditProduct, hasNewImage: boolean): Promise<IProduct> {
        const existing = await productDao.findById(productId);

        if (existing.type === ProductType.Single && data.type === ProductType.Subscription) {
            throw new Error(
                'Converting a product into a subscription is not supported here. ' +
                'Create a new subscription product instead.',
            );
        }

        const imageUrl = await this.uploadReplacementImage(productId, hasNewImage, data.image);

        const updated = await this.updateProduct({
            productId,
            data: { name: data.name, type: data.type, amount: data.amount, currency: data.currency, imageUrl },
        });

        return updated;
    }

    async updateProduct(params: IUpdateProductInput): Promise<IProduct> {
        const { data, productId } = params;
        const { imageUrl, ...rest } = data;

        if (imageUrl === undefined) {
            return productDao.update(rest, productId);
        }

        const previousImageUrl = (await productDao.findById(productId)).image_url;
        const updated = await productDao.update({ ...rest, image_url: imageUrl }, productId);

        // The old file is removed only after the row points at the new one, so a
        // failed update never leaves the product referencing a deleted file; the
        // cleanup itself is best-effort — a failure orphans a file, not the product.
        if (previousImageUrl && previousImageUrl !== imageUrl) {
            await productImageService.deleteImageByUrl(previousImageUrl).catch(() => undefined);
        }

        return updated;
    }

    async deleteProduct(productId: string): Promise<void> {
        const product = await productDao.findById(productId);

        if (product.stripe_product_id) {
        }

        if (product.image_url) {
            await productImageService.deleteImageByUrl(product.image_url);
        }

        await productDao.delete(productId);
    }

    private async uploadReplacementImage(
        productId: string,
        hasNewImage: boolean,
        image?: FileList,
    ): Promise<string | undefined> {
        if (!hasNewImage || !image || image.length === 0) {
            return undefined;
        }

        const [file] = image;
        const { publicUrl } = await productImageService.uploadProductImage(productId, file);

        return publicUrl;
    }

    private async rollbackCreate(productId: string, imagePath?: string): Promise<void> {
        if (imagePath) {
            await productImageService.deleteImageByPath(imagePath).catch(() => undefined);
        }

        await productDao.delete(productId).catch(() => undefined);
    }
}

export default new ProductService;
