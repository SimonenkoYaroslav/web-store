import { IColumn } from '@modules/common/components';
import en from '@modules/product/locales/en';
import { IProduct } from '@modules/product/types';

const t = en.productsTable;

export const priceColumn = (): IColumn<IProduct> => ({
    key: 'price',
    header: t.columns.price,
    cell: (product) => `${product.amount} ${product.currency}`,
});
