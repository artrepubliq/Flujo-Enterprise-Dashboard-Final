export interface IAccessLevelModel {
    name: string;
    enable: any;
    read: boolean;
    write: boolean;
    values?: any;
    feature_id: any;
    access_levels ?: any;
    id?: any;
    user_id ?: string;
    order ?: string;
}
export interface IModuleDetails {
module_id: string;
module_background_color: string;
module_background_image: string;
module_description: string;
client_id: string;
module_name: string;
}

