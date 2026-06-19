import { AbstractStorageService } from '@core/storage/AbstractStorageService';

import { BUCKET_ID } from '../../../constants/storage';
import { createClient } from '../client';

class StorageService extends AbstractStorageService {
    async uploadFile(file: File, path: string): Promise<{ path: string; fullPath: string }> {
        const supabase = createClient();
        const { data, error } = await supabase.storage.from(BUCKET_ID).upload(path, file);

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    async downloadFile(path: string): Promise<Blob> {
        const supabase = createClient();
        const { data, error } = await supabase.storage.from(BUCKET_ID).download(path);

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }
}

export default new StorageService;
