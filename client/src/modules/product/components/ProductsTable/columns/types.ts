import type { Messages, _Translator } from 'next-intl';

/**
 * The `productsTable`-scoped next-intl translator, threaded into each column
 * factory so non-component helpers can localise headers and aria labels without
 * holding their own hook (the table component owns the single `useTranslations`).
 */
export type ProductsTableTranslator = _Translator<Messages, 'productsTable'>;
