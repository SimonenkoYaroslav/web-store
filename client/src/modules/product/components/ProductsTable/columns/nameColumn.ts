import { IColumn } from '@modules/common/components';
import { IProduct } from '@modules/product/types';

import { ProductsTableTranslator } from './types';

export const nameColumn = (t: ProductsTableTranslator): IColumn<IProduct> => ({
    key: 'name',
    header: t('columns.name'),
    cell: (product) => product.name,
});
