'use client'

import { FC, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Image from 'next/image';
import { IProduct } from '@modules/product/types';
import { ProductType } from '@modules/product/enums/ProductType';
import { DeleteProductModal } from '../DeleteProductModal';

interface IProps {
    products: IProduct[];
}

export const ProductsTable: FC<IProps> = ({ products }) => {
    const [deletingProduct, setDeletingProduct] = useState<IProduct | null>(null);

    if (products.length === 0) {
        return <p className="text-center text-gray-500 py-8">No products found.</p>;
    }

    return (
        <>
            <TableContainer component={Paper} className="rounded-lg overflow-hidden shadow">
                <Table>
                    <TableHead className="bg-gray-100">
                        <TableRow>
                            <TableCell className="font-semibold text-gray-800">Image</TableCell>
                            <TableCell className="font-semibold text-gray-800">Name</TableCell>
                            <TableCell className="font-semibold text-gray-800">Type</TableCell>
                            <TableCell className="font-semibold text-gray-800">Price</TableCell>
                            <TableCell className="font-semibold text-gray-800">Created At</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id} className="hover:bg-gray-50">
                                <TableCell>
                                    <Image
                                        src={product.image_url}
                                        alt={product.name}
                                        width={48}
                                        height={48}
                                        className="object-cover rounded"
                                    />
                                </TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={product.type}
                                        color={product.type === ProductType.Subscription ? 'primary' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    {product.amount} {product.currency}
                                </TableCell>
                                <TableCell>
                                    {new Date(product.created_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        size="small"
                                        color="error"
                                        aria-label="delete product"
                                        onClick={() => setDeletingProduct(product)}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

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
