export interface IThemeData{
    error?: string;
    result?: string;
    data? : Array<IThemeResponse>;

}

export interface IThemeResponse
{
    theme_id: number;
    client_id: number;
    child_menu_hover_color: any;
    child_menu_title_color: any;
    primary_menu_hover_color: any;
    primary_menu_title_color: any;
    theme_font_size: number
    title_color: any;
    title_font: any;
    body_font_family: any;
}