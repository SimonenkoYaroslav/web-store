import { ALLOWED_IMAGE_FORMATS } from './constraints';
import { firstFile } from './firstFile';

/** Yup predicate: the selected image (if any) has an allowed MIME type. */
export const hasAllowedFormat = (value: unknown): boolean => {
    const file = firstFile(value);
    return !file || ALLOWED_IMAGE_FORMATS.includes(file.type);
};
