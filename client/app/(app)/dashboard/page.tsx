import productServerService from '@modules/product/services/product.server.service';
import { ProductsTable, AddProductButton } from '@modules/product/components';
import { Suspense } from 'react';

export default async function DashboardPage() {
    const products = await productServerService.fetchProducts();

    return (
        <div className="w-full p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Products</h1>
                <AddProductButton />
            </div>
            <Suspense fallback={<p>Loading posts...</p>}>
                <ProductsTable products={products} />
            </Suspense>
        </div>
    );
}
