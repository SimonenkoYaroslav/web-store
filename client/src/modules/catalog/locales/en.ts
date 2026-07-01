import catalogProducts from '@catalog/components/CatalogProducts/locales/en';
import catalogPage from '@catalog/pages/locales/en';

const en = {
    ...catalogProducts,
    ...catalogPage,
} as const;

export default en;
