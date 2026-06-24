'use client'

import { yupResolver } from '@hookform/resolvers/yup';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormHelperText,
    CircularProgress,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';

import { ImageUpload } from '@common/components';
import { BillingInterval } from '@modules/product/enums/BillingInterval';
import { Currency, CURRENCY_SYMBOL } from '@modules/product/enums/Currency';
import { ProductType } from '@modules/product/enums/ProductType';
import en from '@modules/product/locales/en';
import { productService } from '@modules/product/services';
import { ICreateProduct } from '@modules/product/types';

import { createProductSchema } from './schemas/createProduct.schema';

interface IProps {
    open: boolean;
    onClose: () => void;
}

const t = en.addProductModal;

export const AddProductModal: FC<IProps> = ({ open, onClose }) => {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        control,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: yupResolver(createProductSchema), mode: 'onChange' });

    const isSubscription = useWatch({ control, name: 'type' }) === ProductType.Subscription;

    const handleClose = () => {
        reset();
        onClose();
    };

    const onSubmit = handleSubmit(async (data: ICreateProduct) => {
        try {
            await productService.createProduct(data);
            handleClose();
            router.refresh();
        } catch (err) {
            setError('root', { message: err instanceof Error ? err.message : t.serverError });
        }
    });

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>{t.title}</DialogTitle>
            <form onSubmit={onSubmit}>
                <DialogContent className="flex flex-col gap-4">
                    <TextField
                        {...register('name')}
                        label={t.nameLabel}
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
                                <InputLabel>{t.typeLabel}</InputLabel>
                                <Select {...field} label={t.typeLabel} value={field.value ?? ''}>
                                    {Object.values(ProductType).map((type) => (
                                        <MenuItem key={type} value={type}>{type}</MenuItem>
                                    ))}
                                </Select>
                                {error && <FormHelperText>{error.message}</FormHelperText>}
                            </FormControl>
                        )}
                    />

                    {isSubscription && (
                        <Controller
                            name="interval"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                                <FormControl fullWidth size="small" error={!!error}>
                                    <InputLabel>{t.billingIntervalLabel}</InputLabel>
                                    <Select {...field} label={t.billingIntervalLabel} value={field.value ?? ''}>
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
                            label={t.amountLabel}
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
                                    <InputLabel>{t.currencyLabel}</InputLabel>
                                    <Select {...field} label={t.currencyLabel} value={field.value ?? ''}>
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
                    />

                    {errors.root && (
                        <p className="text-red-500 text-sm">{errors.root.message}</p>
                    )}
                </DialogContent>

                <DialogActions className="px-6 pb-4">
                    <Button onClick={handleClose} disabled={isSubmitting}>
                        {t.cancelButton}
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : null}
                    >
                        {isSubmitting ? t.submittingLabel : t.submitButton}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
