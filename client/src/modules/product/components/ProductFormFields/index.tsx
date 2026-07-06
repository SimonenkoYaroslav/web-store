'use client'

import {
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormHelperText,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { FC } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { ImageUpload } from '@common/components';
import { BillingInterval } from '@modules/product/enums/BillingInterval';
import { Currency, CURRENCY_SYMBOL } from '@modules/product/enums/Currency';
import { ProductType } from '@modules/product/enums/ProductType';

import { IProductFormValues } from './types';

interface IProps {
    withInterval?: boolean;
    imageFallbackSrc?: string | null;
    imageUploadLabel?: string;
    onImageFileChange?: (hasFile: boolean) => void;
}

/**
 * The field set shared by AddProductModal and EditProductModal: name, type,
 * billing interval (only when `withInterval` and the chosen type is
 * Subscription), amount + currency, image upload and the root form error.
 * Reads the form via `useFormContext`, so the owning modal must render it
 * inside a react-hook-form `<FormProvider>`.
 */
export const ProductFormFields: FC<IProps> = ({
    withInterval = false,
    imageFallbackSrc = null,
    imageUploadLabel,
    onImageFileChange,
}) => {
    const t = useTranslations('productFormFields');
    const { register, control, formState: { errors } } = useFormContext<IProductFormValues>();
    const isSubscription = useWatch({ control, name: 'type' }) === ProductType.Subscription;

    return (
        <>
            <TextField
                {...register('name')}
                label={t('nameLabel')}
                fullWidth
                size="small"
                error={!!errors.name}
                helperText={errors.name?.message}
            />

            <Controller
                name="type"
                control={control}
                render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth size="small" error={!!error}>
                        <InputLabel>{t('typeLabel')}</InputLabel>
                        <Select {...field} label={t('typeLabel')} value={field.value ?? ''}>
                            {Object.values(ProductType).map((type) => (
                                <MenuItem key={type} value={type}>{type}</MenuItem>
                            ))}
                        </Select>
                        {error && <FormHelperText>{error.message}</FormHelperText>}
                    </FormControl>
                )}
            />

            {withInterval && isSubscription && (
                <Controller
                    name="interval"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <FormControl fullWidth size="small" error={!!error}>
                            <InputLabel>{t('billingIntervalLabel')}</InputLabel>
                            <Select {...field} label={t('billingIntervalLabel')} value={field.value ?? ''}>
                                {Object.values(BillingInterval).map((interval) => (
                                    <MenuItem key={interval} value={interval}>{interval}</MenuItem>
                                ))}
                            </Select>
                            {error && <FormHelperText>{error.message}</FormHelperText>}
                        </FormControl>
                    )}
                />
            )}

            <div className="flex gap-3">
                <TextField
                    {...register('amount')}
                    label={t('amountLabel')}
                    type="number"
                    size="small"
                    error={!!errors.amount}
                    helperText={errors.amount?.message}
                    className="flex-1"
                />
                <Controller
                    name="currency"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <FormControl size="small" error={!!error} className="w-32">
                            <InputLabel>{t('currencyLabel')}</InputLabel>
                            <Select {...field} label={t('currencyLabel')} value={field.value ?? ''}>
                                {Object.values(Currency).map((currency) => (
                                    <MenuItem key={currency} value={currency}>
                                        {CURRENCY_SYMBOL[currency]} {currency}
                                    </MenuItem>
                                ))}
                            </Select>
                            {error && <FormHelperText>{error.message}</FormHelperText>}
                        </FormControl>
                    )}
                />
            </div>

            <ImageUpload
                registration={register('image')}
                error={errors.image?.message}
                fallbackSrc={imageFallbackSrc}
                uploadLabel={imageUploadLabel}
                onFileChange={onImageFileChange}
            />

            {errors.root && (
                <p className="text-red-500 text-sm">{errors.root.message}</p>
            )}
        </>
    );
};
