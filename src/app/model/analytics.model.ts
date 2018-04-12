export interface ProblemType {
    category: string;
    count: number;
    completed: number;
    in_progress: number;
    unresolved: number;
}

export interface GenderDetails {
    name: String;
    value: Number;
}

export interface AgeDetails {
    name: String;
    value: Number;
}

export interface ReportStatus {
    completed: number;
    in_progress: number;
    unresolved: number;
    id: number;
    name: String;
    email: String;
}

export interface Params {
    client_id: Number;
    from_date: String;
    to_date: String;
}
