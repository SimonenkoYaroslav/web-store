import { BillingInterval } from '@modules/product/enums/BillingInterval';
import { Currency } from '@modules/product/enums/Currency';
import { ProductType } from '@modules/product/enums/ProductType';

export interface ICreateProduct {
    name: string;
    type: ProductType;
    amount: number;
    currency: Currency;
    interval?: BillingInterval;
    image: FileList;
}
