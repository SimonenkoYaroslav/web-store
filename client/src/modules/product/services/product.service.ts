import { createClient } from '@utils/supabase/server';
import { IProduct } from '../types';

class ProductService {
    async fetchProducts(): Promise<IProduct[]> {
        const supabase = await createClient();
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

const productService = new ProductService;
export default productService;
