import { SupabaseClientFactory } from '@core/clients/supabase/types';

/**
 * Context-neutral storage base — mirrors BaseDao's constructor injection: the
 * consuming service supplies the Supabase client factory matching its
 * execution context, so this core layer never imports a concrete client.
 */
export abstract class StorageService {
    protected abstract readonly bucketId: string;

    constructor(protected readonly getClient: SupabaseClientFactory) {}

    protected async uploadFile(file: File, path: string): Promise<{ path: string; fullPath: string }> {
        const supabase = await this.getClient();
        const { data, error } = await supabase.storage.from(this.bucketId).upload(path, file);

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    protected async downloadFile(path: string): Promise<Blob> {
        const supabase = await this.getClient();
        const { data, error } = await supabase.storage.from(this.bucketId).download(path);

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    protected async getPublicUrl(filePath: string): Promise<string> {
        const supabase = await this.getClient();
        const { data: { publicUrl } } = supabase.storage.from(this.bucketId).getPublicUrl(filePath);

        if (!publicUrl) {
            throw new Error('Image not found');
        }

        return publicUrl
    }

    protected async deleteFile(filePath: string): Promise<void> {
        const supabase = await this.getClient();
        const { error } = await supabase.storage.from(this.bucketId).remove([filePath]);

        if (error) { throw new Error(error.message); }
    }
}
