export interface IproblemType {
    result: Array<Iresult>;
}

export interface Iresult {
    id: string;
    problem_type: string;
    submitted_at: string;
    client_id: string;
}

export interface IUpdateableData {
    reportproblemtype_id: string;
    problem_type: string;
    client_id?: string;
}

