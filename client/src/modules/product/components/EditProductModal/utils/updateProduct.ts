import { InferType } from 'yup';

import { productService } from '@modules/product/services';
import productClientService from '@modules/product/services/product-image.service';

import { editProductSchema } from '../schemas/editProduct.schema';

type EditProductFormData = InferType<typeof editProductSchema>;

export const updateProduct = async (
    productId: string,
    data: EditProductFormData,
    hasNewImage: boolean,
) => {
    let imageUrl: string | undefined;

    if (hasNewImage) {
        const file = (data.image as FileList)[0];
        const { path, publicUrl } = await productClientService.uploadProductImage(productId, file);
        await productClientService.deleteProductImagesExcept(productId, path);
        imageUrl = publicUrl;
    }

    return productService.updateProduct(productId, {
        name: data.name,
        type: data.type,
        amount: data.amount,
        currency: data.currency,
        imageUrl,
    });
};
