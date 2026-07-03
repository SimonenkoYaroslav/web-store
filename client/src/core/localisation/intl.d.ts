import type { Locale } from './locales';
import type { Messages } from './messages';

declare module 'next-intl' {
    // eslint-disable-next-line @typescript-eslint/naming-convention -- `AppConfig` is next-intl's typed-config augmentation hook; the interface name is fixed by the library
    interface AppConfig {
        Locale: Locale;
        Messages: Messages;
    }
}
