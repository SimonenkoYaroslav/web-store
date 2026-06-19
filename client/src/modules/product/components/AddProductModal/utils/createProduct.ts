import { productService } from "@modules/product/services";
import productClientService from "@modules/product/services/product-image.service";
import { ICreateProduct } from "@modules/product/types";

export const createProduct = async (data: ICreateProduct) => {
    const createdProduct = await productService.createProduct(data)
    const file = (data.image as FileList)[0];

    const { publicUrl } = await productClientService.uploadProductImage(createdProduct.id, file);

    return productService.updateProduct(createdProduct.id, { imageUrl: publicUrl })

}
