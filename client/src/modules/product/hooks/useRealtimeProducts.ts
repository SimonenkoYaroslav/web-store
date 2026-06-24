'use client';

import { useEffect, useState } from 'react';

import { productService } from '@modules/product/services';
import { IProduct } from '@modules/product/types';

// Keeps a products list in sync with the database in real time. Seed it with
// the server-rendered list (so the first paint has data and SEO/SSR still
// work); thereafter it applies Supabase Realtime row changes on top:
//   - INSERT → prepend the new product (dedup-guarded against the seed)
//   - UPDATE → replace the matching row (this is how a freshly created
//              product's image_url arrives, since creation inserts an empty
//              one first — see productService.subscribeToChanges)
//   - DELETE → drop the matching row
export const useRealtimeProducts = (initialProducts: IProduct[]): IProduct[] => {
    const [products, setProducts] = useState<IProduct[]>(initialProducts);

    useEffect(() => {
        const unsubscribe = productService.subscribeToChanges((payload) => {
            setProducts((current) => {
                switch (payload.eventType) {
                    case 'INSERT': {
                        const inserted = payload.new;

                        if (current.some((product) => product.id === inserted.id)) {
                            return current;
                        }

                        return [inserted, ...current];
                    }

                    case 'UPDATE': {
                        const updated = payload.new;

                        return current.map((product) =>
                            product.id === updated.id ? updated : product,
                        );
                    }

                    case 'DELETE': {
                        return current.filter((product) => product.id !== payload.old.id);
                    }

                    default:
                        return current;
                }
            });
        });

        return unsubscribe;
    }, []);

    return products;
};
