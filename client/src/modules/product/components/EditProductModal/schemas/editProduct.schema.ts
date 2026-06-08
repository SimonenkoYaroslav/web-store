import { object, string, number, mixed } from 'yup';
import { ProductType } from '@modules/product/enums/ProductType';

const ALLOWED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export const editProductSchema = object({
    name: string().required('Name is required'),
    type: mixed<ProductType>()
        .oneOf(Object.values(ProductType), 'Invalid product type')
        .required('Type is required'),
    amount: number()
        .typeError('Amount must be a number')
        .required('Amount is required')
        .min(0, 'Amount must be non-negative'),
    currency: string().required('Currency is required'),
    image: mixed<FileList>()
        .optional()
        .test('fileFormat', 'Only JPEG, PNG and WebP images are allowed', (value) => {
            if (!(value instanceof FileList) || value.length === 0) return true;
            return ALLOWED_FORMATS.includes(value[0].type);
        })
        .test('fileSize', 'Image must be smaller than 5 MB', (value) => {
            if (!(value instanceof FileList) || value.length === 0) return true;
            return value[0].size <= MAX_FILE_SIZE;
        }),
});
