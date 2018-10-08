export interface ICreateUserDetails {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
}
export interface IActiveUsers {
    // CHATCAMP USER INTERFACE
    id: string | number;
    access_token: string;
    is_logged_in: string;
    isUserActive: boolean;
    isUserCanChat: boolean;
    can_chat: boolean;
    name: string;
}
