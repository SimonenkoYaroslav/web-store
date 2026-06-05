import { BUCKET_ID } from "../../../constants/storage";
import { createClient } from "../client";


class StorageService {
    async uploadFile(file: File, path: string) {
        const supabase = createClient();
        const { data, error } = await supabase.storage.from(BUCKET_ID).upload(path, file);

        if (error) {
            console.log(error);
            throw new Error(error.message);
        }

        return data;
    }
}

export default StorageService;