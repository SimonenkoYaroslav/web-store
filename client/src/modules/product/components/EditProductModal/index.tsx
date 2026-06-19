'use client'

import { FC, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
import { Button, ImageUpload } from '@components';
import { IProduct } from '@modules/product/types';
import { ProductType } from '@modules/product/enums/ProductType';
import { editProductSchema } from './schemas/editProduct.schema';
import { updateProduct } from './utils/updateProduct';

interface IProps {
    open: boolean;
    product: IProduct;
    onClose: () => void;
}

export const EditProductModal: FC<IProps> = ({ open, product, onClose }) => {
    const router = useRouter();
    const [hasNewImage, setHasNewImage] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(editProductSchema),
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
            setError('root', { message: err instanceof Error ? err.message : 'Something went wrong' });
        }
    });

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Edit Product</DialogTitle>
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
                        fallbackSrc={product.image_url}
                        uploadLabel="Replace Image"
                        onFileChange={setHasNewImage}
                    />

                    {errors.root && (
                        <p className="text-red-500 text-sm">{errors.root.message}</p>
                    )}
                </DialogContent>

                <DialogActions className="px-6 pb-4">
                    <Button onClick={handleClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" loading={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
