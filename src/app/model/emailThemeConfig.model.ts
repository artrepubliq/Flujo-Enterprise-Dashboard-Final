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
    isActive?: boolean;
}
export interface ICsvData {
    Email: string;
    Name: string;
    Phone: string;
}
