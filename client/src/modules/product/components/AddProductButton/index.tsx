'use client'

import { useTranslations } from 'next-intl';
import { FC, useState } from 'react';

import { Button } from '@common/components';
import { AddProductModal } from '@modules/product/components/AddProductModal';

export const AddProductButton: FC = () => {
    const t = useTranslations('addProductButton');
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button variant="contained" onClick={() => setOpen(true)}>
                {t('label')}
            </Button>
            <AddProductModal open={open} onClose={() => setOpen(false)} />
        </>
    );
};
