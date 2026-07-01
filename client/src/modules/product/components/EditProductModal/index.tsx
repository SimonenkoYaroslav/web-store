'use client'

import { yupResolver } from '@hookform/resolvers/yup';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormHelperText,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { FC, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

import { Button, ImageUpload } from '@common/components';
import { Currency, CURRENCY_SYMBOL } from '@modules/product/enums/Currency';
import { ProductType } from '@modules/product/enums/ProductType';
import { IProduct } from '@modules/product/types';

import { createEditProductSchema } from './schemas/editProduct.schema';
import { updateProduct } from './utils/updateProduct';

interface IProps {
    open: boolean;
    product: IProduct;
    onClose: () => void;
}

export const EditProductModal: FC<IProps> = ({ open, product, onClose }) => {
    const t = useTranslations('editProductModal');
    const router = useRouter();
    const [hasNewImage, setHasNewImage] = useState(false);
    const schema = useMemo(() => createEditProductSchema(t), [t]);

    const {
        register,
        handleSubmit,
        control,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            name: product.name,
            type: product.type,
            amount: product.amount,
            currency: product.currency,
        },
    });

    const handleClose = () => {
        setHasNewImage(false);
        reset();
        onClose();
    };

    const onSubmit = handleSubmit(async (data) => {
        try {
            await updateProduct(product.id, data, hasNewImage);
            handleClose();
            router.refresh();
        } catch (err) {
            setError('root', { message: err instanceof Error ? err.message : t('serverError') });
        }
    });

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>{t('title')}</DialogTitle>
            <form onSubmit={onSubmit}>
                <DialogContent className="flex flex-col gap-4">
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
                        fallbackSrc={product.image_url}
                        uploadLabel={t('replaceImageLabel')}
                        onFileChange={setHasNewImage}
                    />

                    {errors.root && (
                        <p className="text-red-500 text-sm">{errors.root.message}</p>
                    )}
                </DialogContent>

                <DialogActions className="px-6 pb-4">
                    <Button onClick={handleClose} disabled={isSubmitting}>
                        {t('cancelButton')}
                    </Button>
                    <Button type="submit" variant="contained" loading={isSubmitting}>
                        {isSubmitting ? t('submittingLabel') : t('submitButton')}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
