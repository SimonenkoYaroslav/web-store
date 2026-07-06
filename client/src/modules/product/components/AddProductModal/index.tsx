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

import { useLogic } from './useLogic';

interface IProps {
    open: boolean;
    onClose: () => void;
}

export const AddProductModal: FC<IProps> = ({ open, onClose }) => {
    const { t, methods, isSubmitting, handleClose, onSubmit } = useLogic(onClose);

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>{t('title')}</DialogTitle>
            <FormProvider {...methods}>
                <form onSubmit={onSubmit}>
                    <DialogContent className="flex flex-col gap-4">
                        <ProductFormFields withInterval />
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
