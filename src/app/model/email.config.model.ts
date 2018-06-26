
export interface IDomainResponse {
    error: boolean;
    data: string | IDomainErrorResponse | IDomainDetails;
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

