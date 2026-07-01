import { IColumn } from '@modules/common/components';
import { IProduct } from '@modules/product/types';

import { actionsColumn, IProductActionHandlers } from './actionsColumn';
import { createdAtColumn } from './createdAtColumn';
import { imageColumn } from './imageColumn';
import { nameColumn } from './nameColumn';
import { priceColumn } from './priceColumn';
import { typeColumn } from './typeColumn';
import { ProductsTableTranslator } from './types';

export { actionsColumn, createdAtColumn, imageColumn, nameColumn, priceColumn, typeColumn };
export type { IProductActionHandlers, ProductsTableTranslator };

/**
 * Builds the ordered column set for the products table.
 *
 * Each column is defined in its own factory so it can be reused or reordered
 * independently; the `productsTable` translator and action handlers are threaded
 * through so the factories stay free of their own translation hook.
 */
export const getProductColumns = (
    t: ProductsTableTranslator,
    handlers: IProductActionHandlers,
): IColumn<IProduct>[] => [
    imageColumn(t),
    nameColumn(t),
    typeColumn(t),
    priceColumn(t),
    createdAtColumn(t),
    actionsColumn(t, handlers),
];
