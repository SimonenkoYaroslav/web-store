import { MIN_IMAGE_HEIGHT, MIN_IMAGE_WIDTH } from './constraints';
import { firstFile } from './firstFile';
import { readImageDimensions } from './readImageDimensions';

/**
 * Yup predicate: the selected image is at least the minimum resolution. Returns
 * true when no file is selected so it can chain after `required` (Add) or sit
 * on an optional field (Edit), and false when the file cannot be decoded.
 */
export const hasMinimumDimensions = async (value: unknown): Promise<boolean> => {
    const file = firstFile(value);
    if (!file) return true;

    try {
        const { width, height } = await readImageDimensions(file);
        return width >= MIN_IMAGE_WIDTH && height >= MIN_IMAGE_HEIGHT;
    } catch {
        return false;
    }
};
