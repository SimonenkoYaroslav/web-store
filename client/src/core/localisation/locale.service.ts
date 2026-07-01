import { cookies } from 'next/headers';

import { CookieKey } from '@common/enums/CookieyKey';

import { Locale, resolveLocale } from './locales';


export const getLocale = async (): Promise<Locale> => {
    const cookieStore = await cookies();

    return resolveLocale(cookieStore.get(CookieKey.LOCALE)?.value);
};

export const changeLocale = async (requested: string): Promise<Locale> => {
    const locale = resolveLocale(requested);
    const cookieStore = await cookies();

    cookieStore.set(CookieKey.LOCALE, locale, { path: '/', sameSite: 'lax' });

    return locale;
};
