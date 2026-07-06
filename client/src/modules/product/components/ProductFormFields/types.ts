import { BillingInterval } from '@modules/product/enums/BillingInterval';
import { Currency } from '@modules/product/enums/Currency';
import { ProductType } from '@modules/product/enums/ProductType';

/**
 * The superset of fields the shared product form renders. Each modal's yup
 * schema infers its own narrower variant (required image on create, no
 * interval on edit); this shape is what `useFormContext` is asserted against
 * inside `ProductFormFields`.
 */
export interface IProductFormValues {
    name: string;
    type: ProductType;
    amount: number;
    currency: Currency;
    interval?: BillingInterval;
    image?: FileList;
}
