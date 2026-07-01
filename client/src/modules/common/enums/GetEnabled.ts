export const getEnabled = <Values extends string>(config: Record<Values, boolean>): Values[] =>
    Object.entries(config)
        .filter(([, enabled]) => enabled)
        .map(([value]) => value as Values);
