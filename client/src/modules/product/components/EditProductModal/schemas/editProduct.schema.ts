import type { Messages, _Translator } from 'next-intl';
import { object, string, number, mixed } from 'yup';

import imageService from '@modules/common/service/image.service';
import { Currency } from '@modules/product/enums/Currency';
import { ProductType } from '@modules/product/enums/ProductType';

type Translate = _Translator<Messages, 'editProductModal'>;

export const createEditProductSchema = (t: Translate) =>
    object({
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
        image: mixed<FileList>()
            .optional()
            .test('fileFormat', t('validation.imageWrongFormat'), imageService.hasAllowedFormat)
            .test('fileSize', t('validation.imageIncompatibleSize'), imageService.hasAllowedSize)
            .test('fileDimensions', t('validation.imageWrongDimensions'), imageService.hasMinimumDimensions),
    });
