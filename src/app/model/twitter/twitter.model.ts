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
    error: boolean;
    data: Array<ITwitterTimelineObject[]>;
}

export interface ITwitIndividualTimeLineObejct {
    error: boolean;
    data: Array<ITwitterTimelineObject>;
}

export interface ITwitterTimelineObject {

    contributors: string | null;
    coordinates: string | null;
    created_at: string;
    entities: ITwitterEntities;
    extended_entities: ITwitterMedia;
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
    header_title?: string;
}

export interface ITwitterEntities {

    hashtags: Array<ITwitterHashTags>;
    symbols: Array<any>;
    urls: Array<ITwitterUrls>;
    user_mentions: Array<ITwitterUserMentions>;
    media?: Array<ITwitterMedia>;

}

export interface ITwitterMedia {
    id: number;
    id_str: string;
    indices: Array<any>;
    media_url: string;
    media_url_https: string;
    url: string;
    display_url: string;
    expanded_url: string;
    type: string;
    sizes: ITwitterSizeType;
    video_info?: ITwitterVideoInfo;
    additional_media_info?: ITwitterAdditionalMediaInfo;
}

export interface ITwitterAdditionalMediaInfo {
    title: string;
    description: string;
    call_to_actions: any;
}

export interface ITwitterCallToActions {
    watch_now: { url: string };
    embeddable: boolean;
    monetizable: boolean;
}

export interface ITwitterVideoInfo {
    aspect_ratio: Array<any>;
    duration_millis: number;
    varients: Array<ITwitterVarients>;
}

export interface ITwitterVarients {
    bitrate: number;
    content_type: string;
    url: string;
}
export interface ITwitterSizeType {
    thumb: ITwitterSizes;
    medium: ITwitterSizes;
    small: ITwitterSizes;
    large: ITwitterSizes;
}
export interface ITwitterSizes {
    w: number;
    h: number;
    resize: string;
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


/*
 *  this is an interface for twitter user profile from node
*/

export interface ITwitUser {
    error: boolean;
    data: ITwitterUserProfile[];
    type?: string;
}
// export interface ITwitterUserdata {
//     twitter: ITwitterUserProfile[];
// }
/**
 * this is a response from twitter for user profile
 */
export interface ITwitterUserProfile {
    id: number;
    id_str: string;
    name: string;
    screen_name: string;
    location: string;
    profile_location: null | string;
    description: string;
    url: string;
    entities: {
        url: {
            urls: {
                url: string;
                expanded_url: string;
                display_url: string;
                indices: any[];
            }[]
        },
        description: {
            urls: {
                url: string;
                expanded_url: string;
                display_url: string;
                indices: any[];
            }[];
        },
    };
    protected: boolean;
    followers_count: number;
    friends_count: number;
    listed_count: number;
    created_at: string;
    favourites_count: number;
    utc_offset: number;
    time_zone: string;
    geo_enabled: boolean;
    verified: boolean;
    statuses_count: number;
    lang: string;
    status: {
        created_at: string;
        id: number;
        id_str: string;
        text: string;
        truncated: false;
        source: string;
        in_reply_to_status_id: null | number;
        in_reply_to_status_id_str: null | string;
        in_reply_to_user_id: null | string;
        in_reply_to_user_id_str: null | string;
        in_reply_to_screen_name: null | string;
        geo: null | number | string;
        coordinates: null | string | number;
        place: null | string;
        contributors: null | string;
        is_quote_status: boolean;
        retweet_count: number;
        favorite_count: number;
        favorited: boolean;
        retweeted: boolean;
        lang: string;
        entities: {
            hashtags: {
                text: string;
                indices: any[];
            }[];
        };
        symbols: string;
        user_mentions: {
            screen_name: string;
            name: string;
            id: number;
            id_str: string;
            indices: any[];
        }[];
        urls: any[];
    };
    contributors_enabled: boolean;
    is_translator: boolean;
    is_translation_enabled: boolean;
    profile_background_color: string;
    profile_background_image_url: string;
    profile_background_image_url_https: string;
    profile_background_tile: boolean;
    profile_image_url: string;
    profile_image_url_https: string;
    profile_link_color: string;
    profile_sidebar_border_color: string;
    profile_sidebar_fill_color: string;
    profile_text_color: string;
    profile_use_background_image: boolean;
    has_extended_profile: boolean;
    default_profile: boolean;
    default_profile_image: boolean;
    following: boolean;
    follow_request_sent: boolean;
    notifications: boolean;
    translator_type: string;
    suspended: boolean;
    needs_phone_verification: boolean;
}


/**
 * this is an interface for a response of twitter when new status is posted
 */
export interface ITStatusResponse {
    data: {
        errors?: {
            code: number;
            message: string;
        }[];
        created_at: string;
        contributors: null | string;
        coordinates: string | null;
        entities: {};
        favorited: boolean;
        favorite_count: number;
        geo: null | string | number;
        id: number;
        id_str: string;
        in_reply_to_screen_name: string;
        in_reply_to_status_id: string;
        in_reply_to_status_id_str: string;
        in_reply_to_user_id: string;
        in_reply_to_user_id_str: string;
        is_quote_status: boolean;
        lang: string;
        place: string;
        retweeted: boolean;
        retweet_count: number;
        source: string;
        text: string;
        truncated: boolean;
        user: {}
    };

}
