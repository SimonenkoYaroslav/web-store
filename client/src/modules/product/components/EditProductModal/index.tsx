'use client'

import { FC, useEffect, useState } from 'react';
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
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@common/components';
import { IProduct } from '@modules/product/types';
import { ProductType } from '@modules/product/enums/ProductType';
import { productClientService } from '@modules/product/services/client';
import { editProductSchema } from './schemas/editProduct.schema';

interface IProps {
    open: boolean;
    product: IProduct;
    onClose: () => void;
}

export const EditProductModal: FC<IProps> = ({ open, product, onClose }) => {
    const router = useRouter();
    const [blobPreview, setBlobPreview] = useState<string | null>(null);
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

    useEffect(() => {
        return () => {
            if (blobPreview) URL.revokeObjectURL(blobPreview);
        };
    }, [blobPreview]);

    const handleClose = () => {
        if (blobPreview) URL.revokeObjectURL(blobPreview);
        setBlobPreview(null);
        setHasNewImage(false);
        reset();
        onClose();
    };

    const { onChange: imageRegisterOnChange, ...imageFieldRest } = register('image');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (blobPreview) URL.revokeObjectURL(blobPreview);
        if (files && files.length > 0) {
            setBlobPreview(URL.createObjectURL(files[0]));
            setHasNewImage(true);
        } else {
            setBlobPreview(null);
            setHasNewImage(false);
        }
        imageRegisterOnChange(e);
    };

    const previewSrc = blobPreview ?? product.image_url;

    const onSubmit = handleSubmit(async (data) => {
        try {
            let imageUrl: string | undefined;

            if (hasNewImage) {
                const file = (data.image as FileList)[0];
                const { path, publicUrl } = await productClientService.uploadProductImage(product.id, file);
                await productClientService.deleteProductImagesExcept(product.id, path);
                imageUrl = publicUrl;
            }

            await productClientService.updateProduct(product.id, {
                name: data.name as string,
                type: data.type as ProductType,
                amount: data.amount as number,
                currency: data.currency as string,
                imageUrl,
            });
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

                    <div>
                        <Button
                            component="label"
                            variant="outlined"
                            fullWidth
                            color={errors.image ? 'error' : 'primary'}
                        >
                            {hasNewImage ? 'Change Image' : 'Replace Image'}
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
                        <div className={`mt-2 rounded border overflow-hidden ${errors.image ? 'border-red-300' : 'border-gray-200'}`}>
                            <Image
                                src={previewSrc}
                                alt="Product preview"
                                width={500}
                                height={160}
                                unoptimized={!!blobPreview}
                                className="w-full h-40 object-contain bg-gray-50"
                            />
                        </div>
                    </div>

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
