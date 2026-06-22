'use client'

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Chip, IconButton } from '@mui/material';
import Image from 'next/image';
import { FC, useState } from 'react';

import { DataTable, IColumn } from '@components';
import en from '@localisation/en';
import { ProductType } from '@modules/product/enums/ProductType';
import { IProduct } from '@modules/product/types';
import { formatDate } from '@modules/product/utils/formatDate';

import { DeleteProductModal } from '../DeleteProductModal';
import { EditProductModal } from '../EditProductModal';

interface IProps {
    products: IProduct[];
}

const t = en.productsTable;

export const ProductsTable: FC<IProps> = ({ products }) => {
    const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
    const [deletingProduct, setDeletingProduct] = useState<IProduct | null>(null);

    const columns: IColumn<IProduct>[] = [
        {
            key: 'image',
            header: t.columns.image,
            cell: (product) => (
                <Image
                    src={product.image_url}
                    alt={product.name}
                    width={48}
                    height={48}
                    className="object-cover rounded"
                />
            ),
        },
        {
            key: 'name',
            header: t.columns.name,
            cell: (product) => product.name,
        },
        {
            key: 'type',
            header: t.columns.type,
            cell: (product) => (
                <Chip
                    label={product.type}
                    color={product.type === ProductType.Subscription ? 'primary' : 'default'}
                    size="small"
                />
            ),
        },
        {
            key: 'price',
            header: t.columns.price,
            cell: (product) => `${product.amount} ${product.currency}`,
        },
        {
            key: 'created_at',
            header: t.columns.createdAt,
            cell: (product) => formatDate(product.created_at),
        },
        {
            key: 'actions',
            header: '',
            align: 'right',
            cell: (product) => (
                <>
                    <IconButton
                        size="small"
                        aria-label={t.ariaLabels.editProduct}
                        onClick={() => setEditingProduct(product)}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        color="error"
                        aria-label={t.ariaLabels.deleteProduct}
                        onClick={() => setDeletingProduct(product)}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </>
            ),
        },
    ];

    return (
        <>
            <DataTable
                columns={columns}
                rows={products}
                getRowKey={(product) => product.id}
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
