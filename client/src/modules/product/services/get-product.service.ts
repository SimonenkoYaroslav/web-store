import { SortOrder } from '@modules/common/enums/SortOrder';
import { productServerDao } from '@modules/product/dao';
import { IProduct } from '@modules/product/types';

class GetProductService {
    async fetchProducts(): Promise<IProduct[]> {
        return productServerDao.findAll({
            page: 1,
            pageSize: 100,
            sortBy: 'created_at',
            sortOrder: SortOrder.DESC,
        });
    }
}

export default new GetProductService;
