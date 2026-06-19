import { MAX_IMAGE_SIZE } from './constraints';
import { firstFile } from './firstFile';

/** Yup predicate: the selected image (if any) is within the size limit. */
export const hasAllowedSize = (value: unknown): boolean => {
    const file = firstFile(value);
    return !file || file.size <= MAX_IMAGE_SIZE;
};
