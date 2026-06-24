'use client'

import { FC, useState } from 'react';

import { Button } from '@common/components';
import { AddProductModal } from '@modules/product/components/AddProductModal';
import en from '@modules/product/locales/en';

const t = en.addProductButton;

export const AddProductButton: FC = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button variant="contained" onClick={() => setOpen(true)}>
                {t.label}
            </Button>
            <AddProductModal open={open} onClose={() => setOpen(false)} />
        </>
    );
};
