import { BillingInterval } from '../enums/BillingInterval';
import { Currency } from '../enums/Currency';
import { ProductType } from '../enums/ProductType';

export interface IProduct {
    id: string;
    created_at: string;
    name: string;
    image_url: string;
    amount: number;
    currency: Currency;
    type: ProductType;
    interval: BillingInterval | null;
    stripe_product_id: string | null;
    stripe_price_id: string | null;
}
