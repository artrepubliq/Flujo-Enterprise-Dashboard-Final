
// this interface is used for fb response
export interface IFBFeedResponse {
    data?: Array<IFBFeedArray>;
    paging?: IPaginigCursors;
}
// this,interface id used for getting the array of feed data
export interface IFBFeedArray {
    id?: string;
    message?: string;
    description?: string;
    full_picture?: any;
    attachments?: Iattacheddata;
    created_time?: string;
    comments?: IMessageComments;
    likes?: IMessageLikes;
    shares?: IShares;
    parent_id: string;
    access_token?: string;
    link?: any;
    // status_type: string;
}

// THIS FUNCTION IS FOR GETTING THE COMMENTS DATA
export interface IMessageComments {
    summary: ILikesSummary;
    data?: IWhoCommentedProfileData[];
}
// THIS INTERFACE IS FOR GETTING THE COMMENTED PERSON DETAILS DATA
export interface IWhoCommentedProfileData {
    created_time: string;
    from: ICommentedProfile;
    id: string;
    message: string;
}
// THIS FUNCTION IS FOR GET COMMENTED PERSON DETAILS
export interface ICommentedProfile {
    name: string;
    id: string;
}
// this interfaces are used to get the likes
export interface IMessageLikes {
    summary: ILikesSummary;
    data?: IWhoLikesProfile[];
}
export interface ILikesSummary {
    total_count: number;
}
// THIS INTERFACE IS FOR GETTING THE SHARES COUNT
export interface IShares {
    count?: string;
}
// this interface is used for getting the pagination data OF THE POST
export interface IPaginigCursors {
    previous?: any;
    next?: any;
}
// this interface is for WHO LIKED PERSON DETAILS
export interface IWhoLikesProfile {
    id: string;
    name: string;
}
// this model is used for profile data
export interface IProfile {
    id: string;
    name: string;
    picture: IPicURLData;
}

export interface IPicURLData {
    data: IPicURL;
}
export interface IPicURL {
    url: any;
}

/*
    FOLLOWING INTERFACES ARE USED TO GET THE IMAGES FOR THE POST
*/
export interface Iattacheddata {
    data?: IAttachData[];
}
export interface IAttachData {
    subattachments?: ISUBAttachData;
}
export interface ISUBAttachData {
    data?: IMediaData[];
}
export interface IMediaData {
    media?: IImage;
}
export interface IImage {
    image?: ISrc;
}
export interface ISrc {
    src?: any;
}


/*
        this interface is used for getting the  Facebook pages
*/
export interface IMyAccounts {
    accounts: IFBPagesList;
    id: string;
    name: string;
}
export interface IFBPagesList {
    data: Array<IFBPages>;
    paging: any;
}

export interface IFBPages {
    access_token: any;
    category: string;
    category_list: Array<IFBPageDetails>;
    perms: any;
    name: string;
    id: string;
}

export interface IFBPageDetails {
    id: string;
    name: string;
}


