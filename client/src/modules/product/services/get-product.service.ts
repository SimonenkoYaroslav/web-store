import { createClient } from '@core/clients/supabase/server';
import { SortOrder } from '@modules/common/enums/SortOrder';
import productDao from '@modules/product/dao/product.dao';
import { IProduct } from '@modules/product/types';

class GetProductService {
    async fetchProducts(): Promise<IProduct[]> {
        const client = await createClient();

        return productDao.findAll(client, {
            page: 1,
            pageSize: 100,
            sortBy: 'created_at',
            sortOrder: SortOrder.DESC,
        });
    }
}

export default new GetProductService;
