const en = {
    productsTable: {
        columns: {
            image: 'Image',
            name: 'Name',
            type: 'Type',
            price: 'Price',
            createdAt: 'Created At',
        },
        ariaLabels: {
            editProduct: 'edit product',
            deleteProduct: 'delete product',
        },
        emptyMessage: 'No products found.',
    },
} as const;

export default en;
