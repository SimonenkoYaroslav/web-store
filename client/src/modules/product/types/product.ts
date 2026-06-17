import { ProductType } from '../enums/ProductType';

export interface IProduct {
    id: string;
    created_at: string;
    name: string;
    image_url: string;
    amount: number;
    currency: string;
    type: ProductType;
}
