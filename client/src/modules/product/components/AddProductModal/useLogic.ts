'use client'

import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { productService } from '@modules/product/services';
import { ICreateProduct } from '@modules/product/types';

import { createProductSchema } from './schemas/createProduct.schema';

export const useLogic = (onClose: () => void) => {
    const t = useTranslations('addProductModal');
    const formT = useTranslations('productFormFields');
    const router = useRouter();
    const schema = useMemo(() => createProductSchema(formT), [formT]);

    const methods = useForm({ resolver: yupResolver(schema), mode: 'onChange' });
    const { handleSubmit, reset, setError, formState: { isSubmitting } } = methods;

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
            setError('root', { message: err instanceof Error ? err.message : t('serverError') });
        }
    });

    return { t, methods, isSubmitting, handleClose, onSubmit };
};
