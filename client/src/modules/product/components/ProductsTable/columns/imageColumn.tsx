import Image from 'next/image';

import { IColumn } from '@modules/common/components';
import { IProduct } from '@modules/product/types';

import { ProductsTableTranslator } from './types';

export const imageColumn = (t: ProductsTableTranslator): IColumn<IProduct> => ({
    key: 'image',
    header: t('columns.image'),
    cell: (product) => (
        <Image
            src={product.image_url}
            alt={product.name}
            width={48}
            height={48}
            className="object-cover rounded"
        />
    ),
});
