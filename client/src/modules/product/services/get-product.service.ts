import { SortOrder } from '@modules/common/enums/SortOrder';
import productDao from '@modules/product/dao/server';
import { IProduct } from '@modules/product/types';

class GetProductService {
    async fetchProducts(): Promise<IProduct[]> {
        return productDao.findAll({
            page: 1,
            pageSize: 100,
            sortBy: 'created_at',
            sortOrder: SortOrder.DESC,
        });
    }
}

export default new GetProductService;
