import { Currency } from '../enums/Currency';
import { ProductType } from '../enums/ProductType';

export interface IUpdateProduct {
    name?: string;
    type?: ProductType;
    amount?: number;
    currency?: Currency;
    imageUrl?: string;
}
