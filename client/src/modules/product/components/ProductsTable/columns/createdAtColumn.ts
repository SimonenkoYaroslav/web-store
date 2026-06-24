import { IColumn } from '@modules/common/components';
import en from '@modules/product/locales/en';
import { IProduct } from '@modules/product/types';
import { formatDate } from '@modules/product/utils/formatDate';

const t = en.productsTable;

export const createdAtColumn = (): IColumn<IProduct> => ({
    key: 'created_at',
    header: t.columns.createdAt,
    cell: (product) => formatDate(product.created_at),
});
