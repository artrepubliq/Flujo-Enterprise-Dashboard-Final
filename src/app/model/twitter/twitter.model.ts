export interface ITwitterresponse {
    error: boolean;
    token_data: ISignInTokenData;
}
/**
 * this is the response from node server when a new login
 * is done from flujo_dshboard
 */
export interface ISignInTokenData {
    oauth_token: string;
    oauth_token_secret: string;
    oauth_callback_confirmed: string;
}

export interface ISocialKeysTableData {
    client_id: string;
    id: string;
    social_appname: string;
    social_keys: ISocialKeysObject;
    submitted_at: string;
}
export interface ISocialKeysObject {
    oauth_token: string;
    oauth_token_secret: string;
    screen_name: string;
    user_id: string;
}


/**
 * this is an interface for getting twitter timeline
 */
export interface ITwitTimeLineObject {
    data: ITwitterTimelineObject[];
}
export interface ITwitterTimelineObject {

    contributors: string | null;
    coordinates: string | null;
    created_at: string;
    entities: ITwitterEntities;
    favorite_count: number;
    favorited: boolean;
    geo: null | string;
    id: number;
    id_str: string;
    in_reply_to_screen_name: string | null;
    in_reply_to_status_id: number | null;
    in_reply_to_status_id_str: string | null;
    in_reply_to_user_id: number | null;
    in_reply_to_user_id_str: string | null;
    is_quote_status: boolean;
    lang: string;
    place: string | null;
    possibly_sensitive?: boolean;
    possibly_sensitive_appealable?: boolean;
    retweet_count: number;
    retweeted: boolean;
    source: string;
    text: string;
    truncated: boolean;
    user: ITwitterUser;

}

export interface ITwitterEntities {

    hashtags: Array<ITwitterHashTags>;
    symbols: Array<any>;
    urls: Array<ITwitterUrls>;
    user_mentions: Array<ITwitterUserMentions>;

}

export interface ITwitterUrls {
    url: string;
    display_url: string;
    expanded_url: string;
    indices: Array<any>;
}

export interface ITwitterHashTags {
    indices: Array<any>;
    text: string;
}

export interface ITwitterUserMentions {
    id: number;
    id_str: string;
    indices: Array<any>;
    name: string;
    screen_name: string;
}
export interface ITwitterUser {
    contributors_enabled: boolean;
    created_at: string;
    default_profile: boolean;
    default_profile_image: boolean;
    description: string;
    entities: ITwitterEntities;
    favourites_count: number;
    follow_request_sent: boolean;
    followers_count: number;
    following: boolean;
    friends_count: boolean;
    geo_enabled: boolean;
    has_extended_profile: boolean;
    id: number;
    id_str: string;
    is_translation_enabled: boolean;
    is_translator: boolean;
    lang: string;
    listed_count: number;
    location: string;
    name: string;
    notifications: boolean;
    profile_background_color: string;
    profile_background_image_url: string;
    profile_background_image_url_https: string;
    profile_background_tile: boolean;
    profile_banner_url: string;
    profile_image_url: string;
    profile_image_url_https: string;
    profile_link_color: string;
    profile_sidebar_border_color: string;
    profile_sidebar_fill_color: string;
    profile_text_color: string;
    profile_use_background_image: boolean;
    protected: boolean;
    screen_name: string;
    statuses_count: number;
    time_zone: string;
    translator_type: string;
    url: string;
    utc_offset: number;
    verified: boolean;
}

export interface ITwitterEntities {
    description: ITwitterUrls2;
    url: Array<ITwitterUrls>;
}

export interface ITwitterUrls2 {
    urls: Array<any>;
}
