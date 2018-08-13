export interface ISMSResponse {
    error: boolean;
    data: any;
}
export interface IGetSenderIds {
    id: number;
    client_id: string;
    sender_id: string;
    submitted_at: string;
}
