import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ICommonInterface } from '../model/commonInterface.model';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../app.constants';

@Injectable()
export class ManageReportService {
    constructor(private httpClient: HttpClient) { }
    getManageReportData(requestUrl: string, client_id: string): Observable<ICommonInterface> {
        return this.httpClient.get<ICommonInterface>(AppConstants.API_URL + requestUrl + client_id);
    }
}
