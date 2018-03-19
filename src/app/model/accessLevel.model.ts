export interface IAccessLevelModel {
    name: string;
    enable: boolean;
    read: boolean;
    write: boolean;
    values?: any;
    feature_id: number;
    access_levels ?: string;
    id?: string;
    UserId ?: string;
    order ?: string;
}
// export interface IAccesLevels {
//     name:string;
//     enable:boolean;
//     read:boolean;
//     write:boolean;
//     values?:any;
//     feature_id:number;
// }
export interface IModuleDetails {
module_id: string;
module_background_color: string;
module_background_image: string;
module_description: string;
client_id: string;
module_name: string;
}
