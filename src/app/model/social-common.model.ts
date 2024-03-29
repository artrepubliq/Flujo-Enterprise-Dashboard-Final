export interface IStreamComposeData {
    streamDetails: IStreamDetails[];
    composedMessage: IComposePost;
}
export interface IStreamDetails {
    social_platform?: string;
    post_id: string;
    access_token?: any;
    name: string;
    social_id: string;
    imageUploadFailedItem?: IImageIds[];
    imageUploadSuccessItem?: IImageIds[];
    postStatus?: boolean;
}

export interface IComposePost {
    message: string;
    link?: string;
    media?: any[];
    from_date?: any;
    to_date?: any;
    from_time?: string;
    to_time?: string;
    status_id?: string;
}

export interface IImageIds {
    image: any;
}

export interface ILoggedInUsersAccounts {
    accounts: IUserAccountPages[];
    social_id: string;
    name: string;
    access_token: any;
    streams: string[];
    order: string;
    social_platform?: string;
}
export interface IUserAccountPages {
    access_token: any;
    name: string;
    id: string;
    social_id?: string;
    social_platform?: string;
}


