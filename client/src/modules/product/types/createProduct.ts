import { ProductType } from '../enums/ProductType';

export interface ICreateProduct {
    name: string;
    type: ProductType;
    amount: number;
    currency: string;
    image: File;
}
