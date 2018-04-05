import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AppConstants } from '../app.constants';
import { Observable } from 'rxjs/Observable';
import { EmailThemeConfig } from '../model/emailThemeConfig.model';

@Injectable()
export class EmailTemplateService {

    constructor(private httpClient: HttpClient) { }

    public getTemplateConfigData(request_url: string, client_id: string): Observable<EmailThemeConfig> {
        return this.httpClient.get<EmailThemeConfig>(AppConstants.API_URL + request_url + client_id);
    }
}
