import { BaseServerDao } from '@core/dao/supabase/BaseServerDao';
import { IProduct } from '@modules/product/types';

class ProductServerDao extends BaseServerDao<IProduct> {
    protected readonly table = 'products';
}

export default new ProductServerDao;
