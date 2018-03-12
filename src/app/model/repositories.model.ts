export interface IRepositories {
    // id: number;
    client_id: number;
    folder: string;
    folder_id: string;
    files: IFiles;
    isActive?: boolean;
    // submitted_at: any;
    // files_object: any;
}
export interface IFiles {
    id: number;
    file_name: string;
    file_path: string;
    file_extension: string;
}
