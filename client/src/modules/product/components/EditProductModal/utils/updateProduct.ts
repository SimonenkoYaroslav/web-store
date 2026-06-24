import { InferType } from 'yup';

import { editProductSchema } from '@modules/product/components/EditProductModal/schemas/editProduct.schema';
import { productService } from '@modules/product/services';
import productImageService from '@modules/product/services/product-image.service';

type EditProductFormData = InferType<typeof editProductSchema>;

export const updateProduct = async (
    productId: string,
    data: EditProductFormData,
    hasNewImage: boolean,
) => {
    let imageUrl: string | undefined;

 
};
