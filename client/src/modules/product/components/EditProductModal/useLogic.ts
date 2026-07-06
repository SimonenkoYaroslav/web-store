'use client'

import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { productService } from '@modules/product/services';
import { IProduct } from '@modules/product/types';

import { createEditProductSchema } from './schemas/editProduct.schema';

export const useLogic = (product: IProduct, onClose: () => void) => {
    const t = useTranslations('editProductModal');
    const formT = useTranslations('productFormFields');
    const router = useRouter();
    const [hasNewImage, setHasNewImage] = useState(false);
    const schema = useMemo(() => createEditProductSchema(formT), [formT]);

    const methods = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            name: product.name,
            type: product.type,
            amount: product.amount,
            currency: product.currency,
        },
    });

    const { handleSubmit, reset, setError, formState: { isSubmitting } } = methods;

    const handleClose = () => {
        setHasNewImage(false);
        reset();
        onClose();
    };

    const onSubmit = handleSubmit(async (data) => {
        try {
            await productService.editProduct(product.id, data, hasNewImage);
            handleClose();
            router.refresh();
        } catch (err) {
            setError('root', { message: err instanceof Error ? err.message : t('serverError') });
        }
    });

    return { t, methods, isSubmitting, handleClose, onSubmit, setHasNewImage };
};
