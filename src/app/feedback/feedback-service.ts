import { Injectable } from '@angular/core';
import { ICommonInterface } from '../model/commonInterface.model';
import { AppConstants } from '../app.constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class FeedbackService {
    constructor(private httpClient: HttpClient) { }
    getFeedback = (requestUrl: string, client_id: string): Observable<ICommonInterface> => {
        return this.httpClient.get<ICommonInterface>(AppConstants.API_URL + requestUrl + client_id);
    }
}
