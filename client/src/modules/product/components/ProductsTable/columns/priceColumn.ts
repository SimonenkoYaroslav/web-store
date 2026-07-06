import { IColumn } from '@modules/common/components';
import { productFormatService } from '@modules/product/services';
import { IProduct } from '@modules/product/types';

import { ProductsTableTranslator } from './types';

export const priceColumn = (t: ProductsTableTranslator): IColumn<IProduct> => ({
    key: 'price',
    header: t('columns.price'),
    cell: (product) => productFormatService.formatPrice(product.amount, product.currency),
});
