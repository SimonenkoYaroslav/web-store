import { createStripeSubscription } from "@modules/product/actions/createStripeSubscription";
import { ProductType } from "@modules/product/enums/ProductType";
import { productService } from "@modules/product/services";
import productClientService from "@modules/product/services/product-image.service";
import { ICreateProduct } from "@modules/product/types";

export const createProduct = async (data: ICreateProduct) => {
    const createdProduct = await productService.createProduct(data)
    const [file] = data.image as FileList;

    const { publicUrl } = await productClientService.uploadProductImage(createdProduct.id, file);

    await productService.updateProduct(createdProduct.id, { imageUrl: publicUrl })

    if (createdProduct.type === ProductType.Subscription) {
        await createStripeSubscription(createdProduct.id);
    }
}
