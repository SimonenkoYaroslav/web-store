import { BillingInterval } from '../enums/BillingInterval';
import { Currency } from '../enums/Currency';
import { ProductType } from '../enums/ProductType';

export interface ICreateProduct {
    name: string;
    type: ProductType;
    amount: number;
    currency: Currency;
    interval?: BillingInterval;
    image: FileList;
}
