import type { Messages, _Translator } from 'next-intl';
import { mixed, number, string } from 'yup';

import imageService from '@modules/common/service/image.service';
import { BillingInterval } from '@modules/product/enums/BillingInterval';
import { Currency } from '@modules/product/enums/Currency';
import { ProductType } from '@modules/product/enums/ProductType';

export type ProductFormTranslator = _Translator<Messages, 'productFormFields'>;

/**
 * Field schemas shared by the create/edit product forms. Each modal composes
 * them into its own `object({ ... })` and layers its differences on top
 * (create requires the image and adds the interval; edit keeps the image
 * optional and has no interval field).
 */
export const createProductFormBaseFields = (t: ProductFormTranslator) => ({
    name: string().required(t('validation.nameRequired')),
    type: mixed<ProductType>()
        .oneOf(Object.values(ProductType), t('validation.typeInvalid'))
        .required(t('validation.typeRequired')),
    amount: number()
        .typeError(t('validation.amountNotNumber'))
        .required(t('validation.amountRequired'))
        .min(0, t('validation.amountNonNegative')),
    currency: mixed<Currency>()
        .oneOf(Object.values(Currency), t('validation.currencyInvalid'))
        .required(t('validation.currencyRequired')),
});

export const createProductIntervalSchema = (t: ProductFormTranslator) =>
    mixed<BillingInterval>()
        .oneOf(Object.values(BillingInterval), t('validation.intervalInvalid'))
        .when('type', {
            is: ProductType.Subscription,
            then: (schema) => schema.required(t('validation.intervalRequired')),
            otherwise: (schema) => schema.notRequired(),
        });

export const createProductImageSchema = (t: ProductFormTranslator) =>
    mixed<FileList>()
        .test('fileFormat', t('validation.imageWrongFormat'), imageService.hasAllowedFormat)
        .test('fileSize', t('validation.imageIncompatibleSize'), imageService.hasAllowedSize)
        .test('fileDimensions', t('validation.imageWrongDimensions'), imageService.hasMinimumDimensions);
