import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../app.constants';
import { IHttpResponse } from '../model/httpresponse.model';
import { IAreaType } from '../model/area.model';
import { ICommonInterface } from '../model/commonInterface.model';
@Injectable()
export class AreaService {

  constructor(private httpClient: HttpClient) { }

  public getAreaData(request_url: string, client_id: string): Observable<any> {
    return this.httpClient.get<ICommonInterface>(AppConstants.API_URL + request_url + client_id);
  }
  public updateAreaType(request_url: string, post_data: Object) {
    return this.httpClient.post<ICommonInterface>(AppConstants.API_URL + request_url, post_data);
  }
  public deleteArea(request_url: string, report_id: string) {
    return this.httpClient.delete<ICommonInterface>(AppConstants.API_URL + request_url + report_id);
  }
}
