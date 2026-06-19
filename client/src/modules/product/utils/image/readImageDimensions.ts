export interface IImageDimensions {
    width: number;
    height: number;
}

/**
 * Reads an image file's intrinsic resolution. Browser-only — decodes the file
 * through an off-screen `Image` and an object URL that is always revoked.
 * Rejects when the file cannot be decoded.
 */
export const readImageDimensions = (file: File): Promise<IImageDimensions> =>
    new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new window.Image();

        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve({ width: img.naturalWidth, height: img.naturalHeight });
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Unable to read image'));
        };

        img.src = url;
    });
