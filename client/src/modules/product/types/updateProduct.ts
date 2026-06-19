import { ProductType } from '../enums/ProductType';

export interface IUpdateProduct {
    name?: string;
    type?: ProductType;
    amount?: number;
    currency?: string;
    imageUrl?: string;
}
