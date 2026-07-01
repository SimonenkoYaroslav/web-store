'use client';

import { useEffect, useState } from 'react';

import { productService } from '@modules/product/services';
import { IProduct } from '@modules/product/types';

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
