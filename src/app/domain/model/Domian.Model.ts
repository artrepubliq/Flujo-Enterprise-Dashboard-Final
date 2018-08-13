export interface IListOfAllDomainDetailsObject {
    domains: Array<IDomainsList>;
}

export interface IDomainsList {
    uid: string;
    domain_name: string;
    created: Date;
    boughtAt: Date;
    expiresAt: Date;
    isExternal: boolean;
    serviceType: string;
    cdnEnabled?: any;
    verified: boolean;
    aliases: any[];
    certs: any[];
    dnsDetails?: IDNSResponse[];
    dnsDetailsDisplayed?: boolean;
    registered: boolean;
}
export interface IDomianCheckResponse {
    domain_name: string;
    available: boolean;
    period: number;
    price: number;
}

export interface IAddedDomainResponse {
    created: string;
    uid: string;
    verified: boolean;
}

export interface ICertificates {
    autoRenew: boolean;
    cns: string[];
    created: string;
    expiration: string;
    uid: string;
}

export interface IdomainDeploymentResponse {
    html: IHtmlCSSResponse;
    css: IHtmlCSSResponse;
    domain_name: string;
}

export interface IHtmlCSSResponse {
    mode: number;
    name: string;
    type: string;
    uid: string;
}

export interface IDNSResponse {
    created: string;
    creator: string;
    id: string;
    name: string;
    slug: string;
    type: string;
    updated: number;
    value: string;
}

export interface IRegisteredDomains {
    id: number;
    domain_name: string;
    submitted_at: string;
    client_id: string;
}
