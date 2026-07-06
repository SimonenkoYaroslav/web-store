import localizationService from './locale.service';

export enum Locale {
    EN = 'en',
}

export const LOCALE_CONFIG: Record<Locale, boolean> = {
    [Locale.EN]: true,
};

export const DEFAULT_LOCALE: Locale = Locale.EN;

export const ENABLED_LOCALES = localizationService.getEnabled(LOCALE_CONFIG);


