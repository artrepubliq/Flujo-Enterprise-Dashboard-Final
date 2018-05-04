export interface ITwitterresponse {
    error: boolean;
    token_data: ITokenData;
}

export interface ITokenData {
    oauth_token: string;
    oauth_token_secret: string;
    oauth_callback_confirmed: string;
}
