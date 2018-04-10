export interface ICreateUserDetails {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
}
export interface IloggedinUsers {
    id: string;
    access_token: string;
    is_logged_in: string;
    isUserActive: boolean;
}

