export interface IStreamComposeData {
    streamDetails: IStreamDetails[];
    composedMessage: IComposePost;
}
export interface IStreamDetails {
    social_platform?: string;
    id: string | number;
    access_token?: any;
    screen_name: string;
    social_id: string;
}

export interface IComposePost {
    message: string;
    link?: string;
    media?: any[];
    from_date?: string;
    to_date?: string;
    from_time?: string;
    to_time?: string;
    status_id?: string | number;
}
