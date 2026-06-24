import { BaseClientDao } from '@core/dao/supabase/BaseClientDao';
import { IProduct } from '@modules/product/types';

class ProductClientDao extends BaseClientDao<IProduct> {
    protected readonly table = 'products';
}

export default new ProductClientDao;
