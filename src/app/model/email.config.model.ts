
export interface IDomainResponse {
    error: boolean;
    // data: string | IDomainErrorResponse | IDomainDetails | ICampaignDetails[];
    data: any;
    status?: number;
}

export interface IDomainErrorResponse {
    statusCode: number;
}

export interface IDomainDetails {
    client_id: string;
    domain: IDomain;
    id: any;
    receiving_dns_records: IDnsRecords[];
    sending_dns_records: IDnsRecords[];
    submitted_at: any;
}

export interface IDnsRecords {
    cached: any[];
    priority: string;
    record_type: string;
    valid: string;
    value: string;
    name?: string;
}

export interface IDomain {
    created_at: string;
    id: string;
    is_disabled: boolean;
    name: string;
    require_tls: boolean;
    skip_verification: boolean;
    smtp_login: string;
    smtp_password: string;
    spam_action: string;
    state: string;
    type: string;
    web_prefix: string;
    web_scheme: string;
    wildcard: boolean;
}

export interface IDeleteDomain {
    domain_name: string;
    id: string;
    client_id: string;
}
export interface ICreateCampaign {
    address: string;
    name: string;
    description: String;
}

export interface ICampaignDetails {
    campaign_address: string;
    campaign_details: string;
    client_id: string;
    created_on: string;
    domain: string;
}

export interface ICampaignListDetails {
    access_level: string;
    address: string;
    created_at: string;
    description: string;
    members_count: number;
    name: string;
}


