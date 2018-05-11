import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ICommonInterface } from '../model/commonInterface.model';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../app.constants';

@Injectable()
export class AnalyticsService {
    constructor(private httpClient: HttpClient) { }
    getAnalyticsReportData(requestUrl: string, client_id: string): Observable<ICommonInterface> {
        return this.httpClient.get<ICommonInterface>(AppConstants.API_URL + requestUrl + client_id);
    }
    // getAnalyticsGendertData(requestUrl: string, client_id: string): Observable<ICommonInterface> {
    //     return this.httpClient.get<ICommonInterface>(AppConstants.API_URL + requestUrl + client_id);
    // }
    // getAnalyticsAgeData(requestUrl: string, client_id: string): Observable<ICommonInterface> {
    //     return this.httpClient.get<ICommonInterface>(AppConstants.API_URL + requestUrl + client_id);
    // }
    getAnalyticsAreaData(requestUrl: string, client_id: string): Observable<ICommonInterface> {
        return this.httpClient.get<ICommonInterface>(AppConstants.API_URL + requestUrl + client_id);
    }
}
