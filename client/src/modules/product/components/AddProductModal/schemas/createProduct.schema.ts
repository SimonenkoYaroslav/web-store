import { object, string, number, mixed } from 'yup';

import { BillingInterval } from '@modules/product/enums/BillingInterval';
import { Currency } from '@modules/product/enums/Currency';
import { ProductType } from '@modules/product/enums/ProductType';
import {
    IMAGE_DIMENSIONS_MESSAGE,
    IMAGE_FORMAT_MESSAGE,
    IMAGE_SIZE_MESSAGE,
    hasAllowedFormat,
    hasAllowedSize,
    hasMinimumDimensions,
} from '@modules/product/utils/image';

export const createProductSchema = object({
    name: string().required('Name is required'),
    type: mixed<ProductType>()
        .oneOf(Object.values(ProductType), 'Invalid product type')
        .required('Type is required'),
    interval: mixed<BillingInterval>()
        .oneOf(Object.values(BillingInterval), 'Invalid billing interval')
        .when('type', {
            is: ProductType.Subscription,
            then: (schema) => schema.required('Billing interval is required'),
            otherwise: (schema) => schema.notRequired(),
        }),
    amount: number()
        .typeError('Amount must be a number')
        .required('Amount is required')
        .min(0, 'Amount must be non-negative'),
    currency: mixed<Currency>()
        .oneOf(Object.values(Currency), 'Invalid currency')
        .required('Currency is required'),
    image: mixed<FileList>()
        .required('Image is required')
        .test('hasFile', 'Image is required', (value) => value instanceof FileList && value.length > 0)
        .test('fileFormat', IMAGE_FORMAT_MESSAGE, hasAllowedFormat)
        .test('fileSize', IMAGE_SIZE_MESSAGE, hasAllowedSize)
        .test('fileDimensions', IMAGE_DIMENSIONS_MESSAGE, hasMinimumDimensions),
});
