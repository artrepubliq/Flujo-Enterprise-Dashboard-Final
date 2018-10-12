export interface IUsersResponse {
    error: boolean;
    result: IUser[];
}


export interface IUser {
    _id: string;
    user_id: string;
    user_name: string;
    socket_key?: string;
    is_loggedin: boolean;
}

export interface IUserSocketResponseObject {
    logged_in_users: IUserSocketResponse[];
}
export interface IUserSocketResponse {
    user_id: string;
    socket_key: string;
}

export interface ISelectedUsersChatWindow {
    socket_key: string;
    sender_id: string;
    receiver_name: string;
    receiver_id: string;
    messageUpdateObject: ISendMessageObject;
    chat_history: ISendMessageObject[];
    isWindowOpened: boolean;
    isTyping: boolean;
    isInputActivated: boolean;
    bufferMessage: string;
    isEmojiWindowOpened: boolean;
    isChatWindowMinimized: boolean;
}

export interface ISendMessageObject {
    _id: any;
    socket_key: string;
    sender_id: string;
    receiver_id: string;
    message: string;
    created_time: string;
    received_time: string;
    status: number;
    visibility: boolean;
    message_type: string;
    showMessageOptions: boolean;
}
