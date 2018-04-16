import { Injectable, OnInit, ElementRef, ViewChild, SimpleChanges, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Http, Headers, RequestOptions } from '@angular/http';
import { IHttpResponse } from '../model/httpresponse.model';
import { AppConstants } from '../app.constants';
import { Observable } from 'rxjs/Observable';
import { ICommonInterface } from '../model/commonInterface.model';
@Injectable()
export class SmsTemplateSelectService {
constructor (private htppClient: HttpClient
            ) {

}
getSmsSelectData = (requestUrl: string, CLIENT_ID: string): Observable<any> => {
return this.htppClient.get<ICommonInterface>(AppConstants.API_URL + requestUrl + CLIENT_ID);
}
}
