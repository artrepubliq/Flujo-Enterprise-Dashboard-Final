export interface IPostAssignedUser {
    client_id: string;
    report_issue_id: string;
    assigned_user_name: string;
    email_to_send: string;
}

// this interface is used to  update the reports status in reports table

export interface IPostReportStatus {
    report_id: string;
    report_remarks: string;
    report_status: string;
    updated_by: string;
    email_to_send: string;
    send_reportstatus_phone: string;
    description: string;
}
