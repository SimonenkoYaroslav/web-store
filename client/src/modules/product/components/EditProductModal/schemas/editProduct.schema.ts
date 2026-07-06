import { object } from 'yup';

import {
    createProductFormBaseFields,
    createProductImageSchema,
    ProductFormTranslator,
} from '@modules/product/components/ProductFormFields/schemas/productForm.schema';

export const createEditProductSchema = (t: ProductFormTranslator) =>
    object({
        ...createProductFormBaseFields(t),
        image: createProductImageSchema(t).optional(),
    });
