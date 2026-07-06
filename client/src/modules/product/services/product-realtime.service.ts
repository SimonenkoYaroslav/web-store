import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

import { createClient } from '@core/clients/supabase/client';
import { IProduct } from '@modules/product/types';

/**
 * Owns the Supabase Realtime channel for the products table, keeping the
 * subscription concern out of the CRUD-oriented productService. Client-only.
 */
class ProductRealtimeService {
    subscribeToChanges(
        onChange: (payload: RealtimePostgresChangesPayload<IProduct>) => void,
    ): () => void {
        const supabase = createClient();

        const channel = supabase
            .channel('public:products')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, onChange)
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }
}

export default new ProductRealtimeService;
