import { createClient as createServer } from '@utils/supabase/server';

import { IProduct } from '../types';

class ProductServerService {
    async fetchProducts(): Promise<IProduct[]> {
        const supabase = await createServer();

        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error(error.message);
        }

        return data ?? [];
    }
}

const productServerService = new ProductServerService;
export default productServerService;
