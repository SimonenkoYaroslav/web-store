import { createClient } from '../../clients/supabase/client';

export abstract class StorageService {
    protected abstract readonly bucketId: string;
    protected async uploadFile(file: File, path: string): Promise<{ path: string; fullPath: string }> {
        const supabase = createClient();
        const { data, error } = await supabase.storage.from(this.bucketId).upload(path, file);

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    protected async downloadFile(path: string): Promise<Blob> {
        const supabase = createClient();
        const { data, error } = await supabase.storage.from(this.bucketId).download(path);

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    protected async getPublicUrl(filePath: string): Promise<string> {
        const supabase = createClient();
        const { data: { publicUrl } } = supabase.storage.from(this.bucketId).getPublicUrl(filePath);

        if (!publicUrl) {
            throw new Error('Image not found');
        }

        return publicUrl
    }

    protected async deleteFile(filePath: string): Promise<void> {
        const supabase = createClient();
        const { error } = await supabase.storage.from(this.bucketId).remove([filePath]);

        if (error) { throw new Error(error.message); }
    }
}
