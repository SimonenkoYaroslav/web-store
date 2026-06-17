import { ProductType } from '../enums/ProductType';

export interface ICreateProduct {
    id: string;
    name: string;
    type: ProductType;
    amount: number;
    currency: string;
    imageUrl: string;
}
