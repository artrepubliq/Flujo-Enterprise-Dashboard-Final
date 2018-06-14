export interface IUserFeedback {
    id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    datenow: string;
}
export interface IUserChangemaker {
    id: string;
    name: string;
    email: string;
    phone: string;
    datenow: string;
}
export interface MediaDetail {
    image: string|any;
    id: string;
    isActive: boolean;
}
export interface SelectedImages {
    image: string;
    imageType: string;
}
