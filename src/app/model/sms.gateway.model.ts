export interface ISMSResponse {
    error: boolean;
    data: any;
    status?: number;
}
export interface IGetSenderIds {
    id: number;
    client_id: string;
    sender_id: string;
    submitted_at: string;
    country_name: string;
    approved: string;
    message: string;
    sms_plan: string;
    user_name: string;
    website_url: string;
}
