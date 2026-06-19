/**
 * Formats an ISO date string as DD.MM.YYYY.
 *
 * Deterministic and locale-independent so server and client render the same
 * string — `toLocaleDateString()` would format per-environment locale and
 * cause an SSR hydration mismatch.
 */
export const formatDate = (value: string | Date): string => {
    const date = new Date(value);

    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();

    return `${day}.${month}.${year}`;
};
