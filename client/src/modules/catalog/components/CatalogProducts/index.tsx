'use client';

import Image from 'next/image';
import { FC } from 'react';

import en from '@modules/catalog/locales/en';
import { useRealtimeProducts, ProductType } from '@modules/product';
import { IProduct } from '@modules/product/types';

interface IProps {
    initialProducts: IProduct[];
}

const t = en.catalogProducts;

export const CatalogProducts: FC<IProps> = ({ initialProducts }) => {
    // const products = useRealtimeProducts(initialProducts);

    if (initialProducts.length === 0) {
        return (
            <div className="glass-panel mt-8 py-12 text-center uppercase tracking-wider text-brand-600">
                {t.noProducts}
            </div>
        );
    }

    return (
        <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {initialProducts.map((product) => (
                <li key={product.id} className="glass-panel flex flex-col overflow-hidden">
                    <div className="relative aspect-square bg-sand-100">
                        {product.image_url ? (
                            <Image
                                src={product.image_url}
                                alt={product.name}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-xs uppercase text-brand-400">
                                {t.noImage}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-1 flex-col gap-2 border-t-2 border-brand-900 p-4">
                        <h2 className="font-serif text-lg font-semibold text-brand-900">{product.name}</h2>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-700">
                            {product.type === ProductType.Subscription && product.interval
                                ? `${product.type} · ${product.interval}`
                                : product.type}
                        </p>
                        <p className="mt-auto font-mono text-xl font-semibold text-brand-900">
                            {product.amount} {product.currency}
                        </p>
                    </div>
                </li>
            ))}
        </ul>
    );
};
