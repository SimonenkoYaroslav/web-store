'use client'

import { FC, useState } from 'react';

import { DataTable } from '@modules/common/components';
import { DeleteProductModal } from '@modules/product/components/DeleteProductModal';
import { EditProductModal } from '@modules/product/components/EditProductModal';
import { getProductColumns } from '@modules/product/components/ProductsTable/columns';
import en from '@modules/product/locales/en';
import { IProduct } from '@modules/product/types';

interface IProps {
    products: IProduct[];
}

const t = en.productsTable;

export const ProductsTable: FC<IProps> = ({ products }) => {
    const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
    const [deletingProduct, setDeletingProduct] = useState<IProduct | null>(null);

    const columns = getProductColumns({
        onEdit: setEditingProduct,
        onDelete: setDeletingProduct,
    });

    return (
        <>
            <DataTable
                columns={columns}
                rows={products}
                getRowKey={(product: IProduct) => product.id}
                emptyMessage={t.emptyMessage}
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
