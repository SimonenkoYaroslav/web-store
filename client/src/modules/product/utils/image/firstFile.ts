/** Picks the first selected file from a react-hook-form FileList value, or null. */
export const firstFile = (value: unknown): File | null =>
    value instanceof FileList && value.length > 0 ? value[0] : null;
