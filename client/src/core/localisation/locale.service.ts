import { cookies } from 'next/headers';

import { CookieKey } from '@common/enums/CookieKey';

import { DEFAULT_LOCALE, ENABLED_LOCALES, Locale } from './locales';

class LocalizationService {
    getLocale = async (): Promise<Locale> => {
        const cookieStore = await cookies();

        return this.resolveLocale(cookieStore.get(CookieKey.LOCALE)?.value);
    }

    async changeLocale(requested: string): Promise<Locale> {
        const locale = this.resolveLocale(requested);
        const cookieStore = await cookies();

        cookieStore.set(CookieKey.LOCALE, locale, { path: '/', sameSite: 'lax' });

        return locale;
    }

    getEnabled<Values extends string>(config: Record<Values, boolean>): Values[] {
        return Object.entries(config)
            .filter(([, enabled]) => enabled)
            .map(([value]) => value as Values);
    }

    private isEnabledLocale(value: string | undefined | null): boolean {
        return ENABLED_LOCALES.includes(value as Locale);
    }

    private resolveLocale(requested: string | undefined | null): Locale {
        return this.isEnabledLocale(requested) ? requested as Locale : DEFAULT_LOCALE;
    }

}

export default new LocalizationService;