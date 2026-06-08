'use client'

import { FC, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ProductType } from '@modules/product/enums/ProductType';
import { productClientService } from '@modules/product/services/client';
import { createProductSchema } from './schemas/createProduct.schema';

interface IProps {
    open: boolean;
    onClose: () => void;
}

export const AddProductModal: FC<IProps> = ({ open, onClose }) => {
    const router = useRouter();
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        control,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: yupResolver(createProductSchema), mode: 'onChange' });

    useEffect(() => {
        return () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
        };
    }, [imagePreview]);

    const handleClose = () => {
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
        reset();
        onClose();
    };

    const { onChange: imageRegisterOnChange, ...imageFieldRest } = register('image');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImagePreview(files && files.length > 0 ? URL.createObjectURL(files[0]) : null);
        imageRegisterOnChange(e);
    };

    const onSubmit = handleSubmit(async (data) => {
        try {
            const productId = crypto.randomUUID();
            const file = (data.image as FileList)[0];
            const { publicUrl } = await productClientService.uploadProductImage(productId, file);

            await productClientService.createProduct({
                id: productId,
                name: data.name as string,
                type: data.type as ProductType,
                amount: data.amount as number,
                currency: data.currency as string,
                imageUrl: publicUrl,
            });
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

                    <div>
                        <Button
                            component="label"
                            variant="outlined"
                            fullWidth
                            color={errors.image ? 'error' : 'primary'}
                        >
                            {imagePreview ? 'Change Image' : 'Upload Image'}
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                hidden
                                {...imageFieldRest}
                                onChange={handleImageChange}
                            />
                        </Button>
                        {errors.image && (
                            <p className="text-red-500 text-xs mt-1 ml-1">{errors.image.message}</p>
                        )}
                        {imagePreview && (
                            <div className={`mt-2 rounded border overflow-hidden ${errors.image ? 'border-red-300' : 'border-gray-200'}`}>
                                <Image
                                    src={imagePreview}
                                    alt="Preview"
                                    width={500}
                                    height={160}
                                    unoptimized
                                    className="w-full h-40 object-contain bg-gray-50"
                                />
                            </div>
                        )}
                    </div>

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
