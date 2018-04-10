// export interface EmailThemeConfig {
//     client_id: string;
//     id: string;
//     submitted_at: string;
//     template_category: string;
//     template_html: string;
//     template_name: string;
// }

export interface IPostEmailTemplate {

    error?: string;
    result?: string;
    // data?: IPostEmailTemplate;
    client_id?: string;
    template_name?: string;
    template_category?: string;
    template_html?: string;
    emailtemplateconfig_id?: string;
    id?: string;
    submitted_at?: string;
}
//  export interface IEmailTempInsertResponse {
//     error?: string;
//     result?: string;
//     // data?: IPostEmailTemplate;
//     client_id?: string;
//     template_name?: string;
//     template_category?: string;
//     template_html?: string;
//     emailtemplateconfig_id?: string;
//     id?: string;
//  }
