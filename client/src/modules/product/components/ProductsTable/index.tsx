'use client'

import { useTranslations } from 'next-intl';
import { FC, useState } from 'react';

import { DataTable } from '@modules/common/components';
import { DeleteProductModal } from '@modules/product/components/DeleteProductModal';
import { EditProductModal } from '@modules/product/components/EditProductModal';
import { getProductColumns } from '@modules/product/components/ProductsTable/columns';
import { useRealtimeProducts } from '@modules/product/hooks/useRealtimeProducts';
import { IProduct } from '@modules/product/types';

interface IProps {
    initialProducts: IProduct[];
}

export const ProductsTable: FC<IProps> = ({ initialProducts }) => {
    const t = useTranslations('productsTable');
    const products = useRealtimeProducts(initialProducts);
    const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
    const [deletingProduct, setDeletingProduct] = useState<IProduct | null>(null);

    const columns = getProductColumns(t, {
        onEdit: setEditingProduct,
        onDelete: setDeletingProduct,
    });

    return (
        <>
            <DataTable
                columns={columns}
                rows={products}
                getRowKey={(product: IProduct) => product.id}
                emptyMessage={t('emptyMessage')}
            />

            {editingProduct && (
                <EditProductModal
                    key={editingProduct.id}
                    open
                    product={editingProduct}
                    onClose={() => setEditingProduct(null)}
                />
            )}

            {deletingProduct && (
                <DeleteProductModal
                    open
                    productId={deletingProduct.id}
                    productName={deletingProduct.name}
                    onClose={() => setDeletingProduct(null)}
                />
            )}
        </>
    );
};
