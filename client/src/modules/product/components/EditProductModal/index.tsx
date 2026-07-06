'use client'

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { FC } from 'react';
import { FormProvider } from 'react-hook-form';

import { Button } from '@common/components';
import { ProductFormFields } from '@modules/product/components/ProductFormFields';
import { IProduct } from '@modules/product/types';

import { useLogic } from './useLogic';

interface IProps {
    open: boolean;
    product: IProduct;
    onClose: () => void;
}

export const EditProductModal: FC<IProps> = ({ open, product, onClose }) => {
    const { t, methods, isSubmitting, handleClose, onSubmit, setHasNewImage } = useLogic(product, onClose);

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>{t('title')}</DialogTitle>
            <FormProvider {...methods}>
                <form onSubmit={onSubmit}>
                    <DialogContent className="flex flex-col gap-4">
                        <ProductFormFields
                            imageFallbackSrc={product.image_url}
                            imageUploadLabel={t('replaceImageLabel')}
                            onImageFileChange={setHasNewImage}
                        />
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
            </FormProvider>
        </Dialog>
    );
};
