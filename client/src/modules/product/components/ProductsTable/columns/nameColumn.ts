import { IColumn } from '@modules/common/components';
import en from '@modules/product/locales/en';
import { IProduct } from '@modules/product/types';

const t = en.productsTable;

export const nameColumn = (): IColumn<IProduct> => ({
    key: 'name',
    header: t.columns.name,
    cell: (product) => product.name,
});
