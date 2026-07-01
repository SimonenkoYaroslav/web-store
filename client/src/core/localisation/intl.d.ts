import type { Locale } from './locales';
import type { Messages } from './messages';

/**
 * Strongly-types the next-intl APIs against the actual message catalog, so
 * `useTranslations`/`getTranslations` namespaces and keys are checked at compile
 * time. next-intl re-exports `AppConfig` from `use-intl/core`, so augmenting the
 * `next-intl` module merges into the interface its `Messages`/`Locale` helpers read.
 */
declare module 'next-intl' {
    // `AppConfig` is next-intl's fixed augmentation target — the name can't take the
    // house `I` prefix without breaking the merge, so the naming rule is disabled here.
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface AppConfig {
        Locale: Locale;
        Messages: Messages;
    }
}
