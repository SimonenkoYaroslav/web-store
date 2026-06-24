import Image from 'next/image';

import { IColumn } from '@modules/common/components';
import en from '@modules/product/locales/en';
import { IProduct } from '@modules/product/types';

const t = en.productsTable;

export const imageColumn = (): IColumn<IProduct> => ({
    key: 'image',
    header: t.columns.image,
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
