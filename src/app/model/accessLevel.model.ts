export interface IAccessLevelModel{
    name:string;
    enable:boolean;
    read:boolean;
    write:boolean;
    values?:any;
    feature_id:number;
    access_levels ?: string;
    id?:string;
    UserId ?:string;
    order ?:string
}
// export interface IAccesLevels {
//     name:string;
//     enable:boolean;
//     read:boolean;
//     write:boolean;
//     values?:any;
//     feature_id:number;
// }