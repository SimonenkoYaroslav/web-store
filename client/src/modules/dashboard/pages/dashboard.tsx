import { Suspense } from 'react';

import en from '@modules/dashboard/locales/en';
import { ProductsTable, AddProductButton } from '@modules/product/components';
import getProductService from '@modules/product/services/get-product.service';

const t = en.dashboardPage;

export default async function DashboardPage() {
    const products = await getProductService.fetchProducts();

    return (
        <div className="w-full p-6 md:p-8">
            <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-700">{t.sectionLabel}</p>
                    <h1 className="font-serif text-3xl md:text-4xl font-semibold text-brand-900">{t.title}</h1>
                </div>
                <AddProductButton />
            </div>
            <Suspense fallback={<p className="text-brand-500">{t.loading}</p>}>
                <ProductsTable products={products} />
            </Suspense>
        </div>
    );
}
