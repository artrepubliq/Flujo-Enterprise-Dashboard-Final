// this interface is used for fb response
export interface IFBFeedResponse {
    data: Array<IFBFeedArray>;
    paging: IPaginigCursors;
}
// this,interface id used for getting the array of feed data
export interface IFBFeedArray {
    id?: string;
    message?: string;
    full_picture?: any;
    created_time: string;
    comments: IMessageCommentsLikes;
    likes: IMessageCommentsLikes;
}

// this interfaces are used to get the likes and comments
export interface IMessageCommentsLikes {
    summary: IcommentsLikesSummary;
}
export interface IcommentsLikesSummary {
    total_count: number;
}
// this interface is used for getting the pagination data
export interface IPaginigCursors {
    previous: any;
    next: any;
}
