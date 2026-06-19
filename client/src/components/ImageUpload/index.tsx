'use client'

import { ChangeEvent, FC, useEffect, useState } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import Image from 'next/image';
import { Button } from '@components';

interface IImageUploadProps {
    registration: UseFormRegisterReturn;
    error?: string;
    fallbackSrc?: string | null;
    uploadLabel?: string;
    changeLabel?: string;
    onFileChange?: (hasFile: boolean) => void;
}

/**
 * Shared image upload field for react-hook-form.
 *
 * Owns the local blob preview state and its object-URL lifecycle (creating on
 * select, revoking on replace and on unmount) — the logic previously
 * copy-pasted into AddProductModal and EditProductModal. Pass the result of
 * `register('image')` as `registration`; the component merges its own change
 * handler so RHF still receives the FileList.
 */
const ImageUpload: FC<IImageUploadProps> = ({
    registration,
    error,
    fallbackSrc = null,
    uploadLabel = 'Upload Image',
    changeLabel = 'Change Image',
    onFileChange,
}) => {
    const [preview, setPreview] = useState<string | null>(null);
    const { onChange: registerOnChange, ...fieldRest } = registration;

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (preview) URL.revokeObjectURL(preview);
        const hasFile = !!files && files.length > 0;
        setPreview(hasFile ? URL.createObjectURL(files[0]) : null);
        onFileChange?.(hasFile);
        registerOnChange(e);
    };

    const previewSrc = preview ?? fallbackSrc;

    return (
        <div>
            <Button
                component="label"
                variant="outlined"
                fullWidth
                color={error ? 'error' : 'primary'}
            >
                {preview ? changeLabel : uploadLabel}
                <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    hidden
                    {...fieldRest}
                    onChange={handleChange}
                />
            </Button>
            {error && (
                <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>
            )}
            {previewSrc && (
                <div className={`mt-2 rounded border overflow-hidden ${error ? 'border-red-300' : 'border-gray-200'}`}>
                    <Image
                        src={previewSrc}
                        alt="Preview"
                        width={500}
                        height={160}
                        unoptimized={!!preview}
                        className="w-full h-40 object-contain bg-gray-50"
                    />
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
