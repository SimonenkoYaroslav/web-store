'use client'

import { Chip, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { DataTable, IColumn } from '@common/components';
import { ProductType } from '@modules/product/enums/ProductType';
import { IProduct } from '@modules/product/types';
import { formatDate } from '@modules/product/utils/formatDate';
import Image from 'next/image';
import { FC, useState } from 'react';

import { DeleteProductModal } from '../DeleteProductModal';
import { EditProductModal } from '../EditProductModal';

interface IProps {
    products: IProduct[];
}

export const ProductsTable: FC<IProps> = ({ products }) => {
    const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
    const [deletingProduct, setDeletingProduct] = useState<IProduct | null>(null);

    const columns: IColumn<IProduct>[] = [
        {
            key: 'image',
            header: 'Image',
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
            header: 'Name',
            cell: (product) => product.name,
        },
        {
            key: 'type',
            header: 'Type',
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
            header: 'Price',
            cell: (product) => `${product.amount} ${product.currency}`,
        },
        {
            key: 'created_at',
            header: 'Created At',
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
                        aria-label="edit product"
                        onClick={() => setEditingProduct(product)}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        color="error"
                        aria-label="delete product"
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
                emptyMessage="No products found."
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
