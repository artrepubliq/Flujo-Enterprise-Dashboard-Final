export interface IRepositories {
    // id: number;
    size: string;
    result: Array<IResult>;
    // submitted_at: any;
    // files_object: any;
}
export interface IResult {
    client_id: string;
    folder: string;
    folder_id: string;
    files: Array<IFiles>;
    isShowMb: boolean;
    isShowKb: boolean;
    isActive?: boolean;
    size?: number;
}

export interface IFiles {
    id: string;
    file_name: string;
    file_path: string;
    file_extension: string;
    file_size:  number;
    folder?: string;
    isActive?: boolean;
    isShowMb: boolean;
    isShowKb: boolean;
}
