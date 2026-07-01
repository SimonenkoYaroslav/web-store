import { Chip } from '@mui/material';

import { IColumn } from '@modules/common/components';
import { ProductType } from '@modules/product/enums/ProductType';
import { IProduct } from '@modules/product/types';

import { ProductsTableTranslator } from './types';

export const typeColumn = (t: ProductsTableTranslator): IColumn<IProduct> => ({
    key: 'type',
    header: t('columns.type'),
    cell: (product) => (
        <Chip
            label={product.type}
            color={product.type === ProductType.Subscription ? 'primary' : 'default'}
            size="small"
        />
    ),
});
