import { object } from 'yup';

import {
    createProductFormBaseFields,
    createProductImageSchema,
    createProductIntervalSchema,
    ProductFormTranslator,
} from '@modules/product/components/ProductFormFields/schemas/productForm.schema';

export const createProductSchema = (t: ProductFormTranslator) =>
    object({
        ...createProductFormBaseFields(t),
        interval: createProductIntervalSchema(t),
        image: createProductImageSchema(t)
            .required(t('validation.imageRequired'))
            .test('hasFile', t('validation.imageRequired'), (value) => value instanceof FileList && value.length > 0),
    });
