import { BaseDao } from '@modules/common/dao/supabase/BaseDao';
import { IProduct } from '@modules/product/types';

class ProductDao extends BaseDao<IProduct> {
    protected readonly table = 'products';
}

export default new ProductDao();
