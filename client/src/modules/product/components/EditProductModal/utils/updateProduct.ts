import { productService } from '@modules/product/services';
import { IEditProduct } from '@modules/product/types';

export const updateProduct = async (
    productId: string,
    data: IEditProduct,
    hasNewImage: boolean,
): Promise<void> => {
    await productService.editProduct(productId, data, hasNewImage);
};
