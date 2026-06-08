'use client'

import { FC, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    CircularProgress,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { productClientService } from '@modules/product/services/client';

interface IProps {
    open: boolean;
    productId: string;
    productName: string;
    onClose: () => void;
}

export const DeleteProductModal: FC<IProps> = ({ open, productId, productName, onClose }) => {
    const router = useRouter();
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        setDeleting(true);
        setError(null);
        try {
            await productClientService.deleteProduct(productId);
            onClose();
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setDeleting(false);
        }
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
                <Button onClick={handleClose} disabled={deleting}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    disabled={deleting}
                    onClick={handleDelete}
                    startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : null}
                >
                    {deleting ? 'Deleting...' : 'Delete'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
