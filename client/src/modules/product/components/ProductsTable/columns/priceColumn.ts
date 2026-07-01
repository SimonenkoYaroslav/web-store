import { IColumn } from '@modules/common/components';
import { IProduct } from '@modules/product/types';

import { ProductsTableTranslator } from './types';

export const priceColumn = (t: ProductsTableTranslator): IColumn<IProduct> => ({
    key: 'price',
    header: t('columns.price'),
    cell: (product) => `${product.amount} ${product.currency}`,
});
