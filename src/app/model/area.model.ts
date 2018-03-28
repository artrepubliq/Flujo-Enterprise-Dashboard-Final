export interface IAreaType {
    result: Array<Iresult>;
}

export interface Iresult {
    id: string;
    Area_type: string;
    submitted_at: string;
    client_id: string;
}

export interface IUpdateableData {
    reportarea_id?: string;
    area: string;
    client_id?: string;
    pincode: string;
}

