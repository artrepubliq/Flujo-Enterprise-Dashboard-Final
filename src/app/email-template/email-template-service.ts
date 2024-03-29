import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AppConstants } from '../app.constants';
import { Observable } from 'rxjs/Observable';
import { IPostEmailTemplate } from '../model/emailThemeConfig.model';
import { ICommonInterface } from '../model/commonInterface.model';

@Injectable()
export class EmailTemplateService {

    constructor(private httpClient: HttpClient) { }
    public getTemplateConfigData(request_url: string, client_id: string): Observable<ICommonInterface> {
        return this.httpClient.get<ICommonInterface>(AppConstants.API_URL + request_url + client_id);
    }

    public postEmailTemplateData( post_data: string, request_url: string) {
        return this.httpClient.post<ICommonInterface>(AppConstants.API_URL + request_url, post_data);
    }
    public deleteEmailTemplateData( post_data: string, request_url: string, emailtemplateconfig_id: string) {
        return this.httpClient.delete<IPostEmailTemplate>(AppConstants.API_URL + request_url + emailtemplateconfig_id);
    }
}
