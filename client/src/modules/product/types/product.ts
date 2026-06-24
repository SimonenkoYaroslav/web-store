import { BillingInterval } from '@modules/product/enums/BillingInterval';
import { Currency } from '@modules/product/enums/Currency';
import { ProductType } from '@modules/product/enums/ProductType';

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
