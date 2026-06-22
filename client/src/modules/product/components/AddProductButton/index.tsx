'use client'

import { FC, useState } from 'react';

import { Button } from '@components';
import en from '@modules/product/locales/en';

import { AddProductModal } from '../AddProductModal';

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
