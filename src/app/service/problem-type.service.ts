import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { IproblemType } from '../model/problemType.model';
import { AppConstants } from '../app.constants';
import { Observable } from 'rxjs/Observable';
import { IHttpResponse } from '../model/httpresponse.model';
import { ICommonInterface } from '../model/commonInterface.model';
@Injectable()
export class ProblemTypeService {

  constructor(private httpClient: HttpClient) { }

  public getProblemData(request_url: string, client_id: string): Observable<any> {
    return this.httpClient.get<ICommonInterface>(AppConstants.API_URL + request_url + client_id);
  }
  public updateProblemType(request_url: string, post_data: Object) {
    return this.httpClient.post<ICommonInterface>(AppConstants.API_URL + request_url, post_data);
  }
  public deleteProblem(request_url: string, report_id: string) {
    return this.httpClient.delete<ICommonInterface>(AppConstants.API_URL + request_url + report_id);
  }
}
