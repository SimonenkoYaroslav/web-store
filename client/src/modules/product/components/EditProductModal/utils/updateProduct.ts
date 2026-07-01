import { InferType } from 'yup';

import { createEditProductSchema } from '@modules/product/components/EditProductModal/schemas/editProduct.schema';

type EditProductFormData = InferType<ReturnType<typeof createEditProductSchema>>;

export const updateProduct = async (
    productId: string,
    data: EditProductFormData,
    hasNewImage: boolean,
) => {
    let imageUrl: string | undefined;
 
};
