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
import { useForm, Controller } from 'react-hook-form';

import { ImageUpload } from '@components';
import { ProductType } from '@modules/product/enums/ProductType';
import { ICreateProduct } from '@modules/product/types';

import { createProductSchema } from './schemas/createProduct.schema';
import { createProduct } from './utils/createProduct';

interface IProps {
    open: boolean;
    onClose: () => void;
}

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

    const handleClose = () => {
        reset();
        onClose();
    };

    const onSubmit = handleSubmit(async (data: ICreateProduct) => {
        try {
            await createProduct(data);
            handleClose();
            router.refresh();
        } catch (err) {
            setError('root', { message: err instanceof Error ? err.message : 'Something went wrong' });
        }
    });

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Add Product</DialogTitle>
            <form onSubmit={onSubmit}>
                <DialogContent className="flex flex-col gap-4">
                    <TextField
                        {...register('name')}
                        label="Name"
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
                                <InputLabel>Type</InputLabel>
                                <Select {...field} label="Type" value={field.value ?? ''}>
                                    {Object.values(ProductType).map((t) => (
                                        <MenuItem key={t} value={t}>{t}</MenuItem>
                                    ))}
                                </Select>
                                {error && <FormHelperText>{error.message}</FormHelperText>}
                            </FormControl>
                        )}
                    />

                    <div className="flex gap-3">
                        <TextField
                            {...register('amount')}
                            label="Amount"
                            type="number"
                            size="small"
                            error={!!errors.amount}
                            helperText={errors.amount?.message}
                            className="flex-1"
                        />
                        <TextField
                            {...register('currency')}
                            label="Currency"
                            size="small"
                            error={!!errors.currency}
                            helperText={errors.currency?.message}
                            slotProps={{ htmlInput: { style: { textTransform: 'uppercase' as const } } }}
                            className="w-28"
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
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : null}
                    >
                        {isSubmitting ? 'Adding...' : 'Add Product'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
