import { IColumn } from '@modules/common/components';
import formattingService from '@modules/common/service/formatting.service';
import { IProduct } from '@modules/product/types';

import { ProductsTableTranslator } from './types';

export const createdAtColumn = (t: ProductsTableTranslator): IColumn<IProduct> => ({
    key: 'created_at',
    header: t('columns.createdAt'),
    cell: (product) => formattingService.formatDate(product.created_at),
});
