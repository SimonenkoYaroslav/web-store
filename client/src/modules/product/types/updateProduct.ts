import { Currency } from '@modules/product/enums/Currency';
import { ProductType } from '@modules/product/enums/ProductType';

export interface IUpdateProduct {
    name?: string;
    type?: ProductType;
    amount?: number;
    currency?: Currency;
    imageUrl?: string;
}

export interface IUpdateProductInput {
    productId: string;
    data: IUpdateProduct;
    isImageUpdated?: string;
}
