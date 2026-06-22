import en from '@modules/catalog/locales/en';
import productServerService from '@modules/product/services/product.server.service';

import { CatalogProducts } from '../components';

const t = en.catalogPage;

export default async function CatalogPage() {
    const products = await productServerService.fetchProducts();

    return (
        <div className="w-full p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-700">{t.sectionLabel}</p>
            <h1 className="font-serif text-3xl md:text-4xl font-semibold text-brand-900">{t.title}</h1>
            <p className="mt-2 max-w-prose text-brand-500">
                {t.subtitle}
            </p>

            <CatalogProducts initialProducts={products} />
        </div>
    );
}
