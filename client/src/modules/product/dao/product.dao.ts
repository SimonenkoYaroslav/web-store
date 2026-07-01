import { BaseDao } from '@modules/common/dao/supabase/BaseDao';
import { IProduct } from '@modules/product/types';

export class ProductDao extends BaseDao<IProduct> {
    protected readonly table = 'products';
}
