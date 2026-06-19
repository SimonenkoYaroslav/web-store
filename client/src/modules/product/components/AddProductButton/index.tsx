'use client'

import { FC, useState } from 'react';

import { Button } from '@components';

import { AddProductModal } from '../AddProductModal';

export const AddProductButton: FC = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button variant="contained" onClick={() => setOpen(true)}>
                Add Product
            </Button>
            <AddProductModal open={open} onClose={() => setOpen(false)} />
        </>
    );
};
