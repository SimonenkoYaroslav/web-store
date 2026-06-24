import { Chip } from '@mui/material';

import { IColumn } from '@modules/common/components';
import { ProductType } from '@modules/product/enums/ProductType';
import en from '@modules/product/locales/en';
import { IProduct } from '@modules/product/types';

const t = en.productsTable;

export const typeColumn = (): IColumn<IProduct> => ({
    key: 'type',
    header: t.columns.type,
    cell: (product) => (
        <Chip
            label={product.type}
            color={product.type === ProductType.Subscription ? 'primary' : 'default'}
            size="small"
        />
    ),
});
