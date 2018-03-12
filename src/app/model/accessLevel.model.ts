export interface IAccessLevelModel{
    name:string;
    enable:boolean;
    read:boolean;
    write:boolean;
    values?:any;
    feature_id:number;
}