import { productService } from '@modules/product/services';
import { ProductsTable, AddProductButton } from '@modules/product/components';

export default async function DashboardPage() {
    const products = await productService.fetchProducts();

    return (
        <div className="w-full p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Products</h1>
                <AddProductButton />
            </div>
            <ProductsTable products={products} />
        </div>
    );
}
