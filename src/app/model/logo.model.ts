// export class ILogo {
//     id: number;
//     avatar: string|any;
// }

export interface ILogo{
    client_id: number;
    theme_id: number;
    logo_url_path: string;
    logo_text?: string;
    logo_caption?: string;
    logo_height?: number;
    logo_width?: number;
    isLogoAsImage?: boolean;
    slogan_text: string;
}