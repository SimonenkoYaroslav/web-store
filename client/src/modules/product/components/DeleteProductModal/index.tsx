'use client'

import { FC, useTransition, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { Button } from '@components';
import { productClientService } from '@modules/product/services/client';

interface IProps {
    open: boolean;
    productId: string;
    productName: string;
    onClose: () => void;
}

export const DeleteProductModal: FC<IProps> = ({ open, productId, productName, onClose }) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleDelete = () => {
        startTransition(async () => {
            try {
                await productClientService.deleteProduct(productId);
                onClose();
                router.refresh();
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Something went wrong');
            }
        });
    };

    const handleClose = () => {
        setError(null);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogContent>
                <p className="text-gray-700">
                    Are you sure you want to delete{' '}
                    <span className="font-semibold">&ldquo;{productName}&rdquo;</span>?
                    This action cannot be undone.
                </p>
                {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
            </DialogContent>
            <DialogActions className="px-6 pb-4">
                <Button onClick={handleClose} disabled={isPending}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    loading={isPending}
                    onClick={handleDelete}
                >
                    {isPending ? 'Deleting...' : 'Delete'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
