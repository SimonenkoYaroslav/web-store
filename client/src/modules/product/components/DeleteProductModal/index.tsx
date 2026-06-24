'use client'

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { FC, useTransition, useState } from 'react';

import { Button } from '@common/components';
import en from '@modules/product/locales/en';

interface IProps {
    open: boolean;
    productId: string;
    productName: string;
    onClose: () => void;
}

const t = en.deleteProductModal;

export const DeleteProductModal: FC<IProps> = ({ open, productId: _productId, productName, onClose }) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleDelete = () => {
        startTransition(async () => {
            try {
                onClose();
                router.refresh();
            } catch (err) {
                setError(err instanceof Error ? err.message : t.serverError);
            }
        });
    };

    const handleClose = () => {
        setError(null);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <DialogTitle>{t.title}</DialogTitle>
            <DialogContent>
                <p className="text-brand-700">
                    {t.confirmPrefix}{' '}
                    <span className="font-semibold">&ldquo;{productName}&rdquo;</span>?{' '}
                    {t.cannotUndo}
                </p>
                {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
            </DialogContent>
            <DialogActions className="px-6 pb-4">
                <Button onClick={handleClose} disabled={isPending}>
                    {t.cancelButton}
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    loading={isPending}
                    onClick={handleDelete}
                >
                    {isPending ? t.submittingLabel : t.submitButton}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
