import { getTranslations } from 'next-intl/server';

import { CatalogProducts } from '@catalog/components';
import getProductService from '@modules/product/services/get-product.service';

export default async function CatalogPage() {
    const t = await getTranslations('catalogPage');
    const products = await getProductService.fetchProducts();

    return (
        <div className="w-full p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-700">{t('sectionLabel')}</p>
            <h1 className="font-serif text-3xl md:text-4xl font-semibold text-brand-900">{t('title')}</h1>
            <p className="mt-2 max-w-prose text-brand-500">
                {t('subtitle')}
            </p>

            <CatalogProducts initialProducts={products} />
        </div>
    );
}
