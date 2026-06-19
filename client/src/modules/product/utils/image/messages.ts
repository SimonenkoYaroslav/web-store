import { MIN_IMAGE_HEIGHT, MIN_IMAGE_WIDTH } from './constraints';

export const IMAGE_FORMAT_MESSAGE = 'Only JPEG, PNG and WebP images are allowed';
export const IMAGE_SIZE_MESSAGE = 'Image must be smaller than 5 MB';
export const IMAGE_DIMENSIONS_MESSAGE =
    `Image resolution must be at least ${MIN_IMAGE_WIDTH}x${MIN_IMAGE_HEIGHT}`;
