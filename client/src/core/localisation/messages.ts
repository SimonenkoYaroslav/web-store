import appLocale from '@app/locales/en';
import rootModule from '@modules/index';

import { Locale } from './locales';

const locales = {
    ...rootModule.locales.en,
    ...appLocale,
} as const;

export type Messages = typeof locales;

const MESSAGES_BY_LOCALE: Record<Locale, Messages> = {
    [Locale.EN]: locales,
};

export const getMessages = (locale: Locale): Messages => MESSAGES_BY_LOCALE[locale];

export default locales;
