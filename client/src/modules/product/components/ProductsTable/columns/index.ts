import { IColumn } from '@modules/common/components';
import { IProduct } from '@modules/product/types';

import { actionsColumn, IProductActionHandlers } from './actionsColumn';
import { createdAtColumn } from './createdAtColumn';
import { imageColumn } from './imageColumn';
import { nameColumn } from './nameColumn';
import { priceColumn } from './priceColumn';
import { typeColumn } from './typeColumn';

export { actionsColumn, createdAtColumn, imageColumn, nameColumn, priceColumn, typeColumn };
export type { IProductActionHandlers };

/**
 * Builds the ordered column set for the products table.
 *
 * Each column is defined in its own factory so it can be reused or reordered
 * independently; the action handlers are threaded through to the actions column.
 */
export const getProductColumns = (handlers: IProductActionHandlers): IColumn<IProduct>[] => [
    imageColumn(),
    nameColumn(),
    typeColumn(),
    priceColumn(),
    createdAtColumn(),
    actionsColumn(handlers),
];
