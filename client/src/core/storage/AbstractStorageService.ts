export abstract class AbstractStorageService {
    abstract uploadFile(file: File, path: string): Promise<{ path: string; fullPath: string }>;
    abstract downloadFile(path: string): Promise<Blob>;
}
