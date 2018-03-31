export interface IcustomLoginModelDetails {
    access_token: string;
    result: string;
    status?: boolean;
    user_id: string;
    can_chat: boolean;
    chatcamp_accesstoken: any;
    email_verified?: string;
}

export interface IPostChatCampModel {
    chatcamp_accesstoken: any;
    user_id: string;
}
