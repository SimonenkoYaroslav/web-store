import addProductButton from '@modules/product/components/AddProductButton/locales/en';
import addProductModal from '@modules/product/components/AddProductModal/locales/en';
import deleteProductModal from '@modules/product/components/DeleteProductModal/locales/en';
import editProductModal from '@modules/product/components/EditProductModal/locales/en';
import productsTable from '@modules/product/components/ProductsTable/locales/en';

const en = {
    ...addProductButton,
    ...addProductModal,
    ...deleteProductModal,
    ...editProductModal,
    ...productsTable,
} as const;

export default en;
