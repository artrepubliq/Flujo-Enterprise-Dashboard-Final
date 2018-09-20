export interface IUserAccessLevels {
    features: Ifeatures[];
    services: Iservices[];
}

export interface Ifeatures {
    client_id: string;
    extend_expiry_date: string;
    feature_access_token: string;
    feature_id: string;
    feature_name: string;
    feature_route: string;
    id: number;
    is_expired: boolean;
    has_subfeature: boolean;
    sub_features: ISubFeatures[];
    isEnabled: boolean;
    isActive: boolean;
}

export interface ISubFeatures {
    feature_id: string;
    id: any;
    subfeature_id: string;
    subfeature_name: string;
    subfeature_route: string;
    submitted_at: string;
    isEnabled: boolean;
}

export interface Iservices {
    basic: Ifeatures[];
    chat: Ifeatures[];
    drive: Ifeatures[];
    editor: Ifeatures[];
    flow: Ifeatures[];
    nucleus: Ifeatures[];
}

/**
 * THIS IS FOR USER'S ENABLED FEATURES
 */
export interface IUserFeatures {
    feature_id: string;
    sub_feature_ids?: string[];
}
