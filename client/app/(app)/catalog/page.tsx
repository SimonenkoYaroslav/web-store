import { Suspense } from 'react';

import CatalogPage from '@modules/catalog/pages/catalog';

export default function Catalog() {
    return (
        <Suspense><CatalogPage /></Suspense>
    );
}
