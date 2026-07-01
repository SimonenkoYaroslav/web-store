import { getEnabled } from '@core/utils/getEnabled';


export enum Locale {
    EN = 'en',
}

export const LOCALE_CONFIG: Record<Locale, boolean> = {
    [Locale.EN]: true,
};

export const ENABLED_LOCALES = getEnabled(LOCALE_CONFIG);

export const DEFAULT_LOCALE: Locale = Locale.EN;

export const isEnabledLocale = (value: string | undefined | null): value is Locale =>
    ENABLED_LOCALES.includes(value as Locale);


export const resolveLocale = (requested: string | undefined | null): Locale =>
    isEnabledLocale(requested) ? requested : DEFAULT_LOCALE;
