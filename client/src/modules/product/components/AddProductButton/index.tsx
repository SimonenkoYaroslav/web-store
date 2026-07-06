'use client'

import { useTranslations } from 'next-intl';
import { FC } from 'react';

import { Button } from '@common/components';
import { useModal } from '@common/hooks/useModal';
import { AddProductModal } from '@modules/product/components/AddProductModal';

export const AddProductButton: FC = () => {
    const t = useTranslations('addProductButton');
    const { isOpen, showModal, hideModal } = useModal();

    return (
        <>
            <Button variant="contained" onClick={showModal}>
                {t('label')}
            </Button>
            <AddProductModal open={isOpen} onClose={hideModal} />
        </>
    );
};
