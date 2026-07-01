/**
 * Collapses a `{ value: enabled }` config into the list of values whose flag is
 * `true`. Handy for turning an enum-keyed feature map (locales, feature flags, …)
 * into a runtime allow-list.
 *
 * @example
 * getEnabled({ en: true, uk: false }); // => ['en']
 */
export const getEnabled = <Values extends string>(config: Record<Values, boolean>): Values[] =>
    Object.entries(config)
        .filter(([, enabled]) => enabled)
        .map(([value]) => value as Values);
