import { Currency } from '@modules/product/enums/Currency';
import { ProductType } from '@modules/product/enums/ProductType';

export interface IEditProduct {
    name: string;
    type: ProductType;
    amount: number;
    currency: Currency;
    image?: FileList;
}
