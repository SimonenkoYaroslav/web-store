export interface IImageDimensions {
    width: number;
    height: number;
}

class ImageService {
    ALLOWED_IMAGE_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];
    MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
    MIN_IMAGE_WIDTH = 307;
    MIN_IMAGE_HEIGHT = 350;

    hasAllowedFormat = (value: unknown): boolean => {
        const file = this.pickFirstFile(value);
        return !file || this.ALLOWED_IMAGE_FORMATS.includes(file.type);
    };

    hasAllowedSize = (value: unknown): boolean => {
        const file = this.pickFirstFile(value);
        return !file || file.size <= this.MAX_IMAGE_SIZE;
    };

    pickFirstFile(value: unknown): File | null {
        return value instanceof FileList && value.length > 0 ? value[0] : null;
    }

    hasMinimumDimensions = async (value: unknown): Promise<boolean> => {
        const file = this.pickFirstFile(value);

        if (!file) { return true; }

        try {
            const { width, height } = await this.readImageDimensions(file);
            return width >= this.MIN_IMAGE_WIDTH && height >= this.MIN_IMAGE_HEIGHT;
        } catch {
            return false;
        }
    };

    async readImageDimensions(file: File): Promise<IImageDimensions> {
        return new Promise((resolve, reject) => {
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
    }

}

export default new ImageService;
