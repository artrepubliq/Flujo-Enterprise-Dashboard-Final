import { Injectable } from '../../../node_modules/@angular/core';
import { HttpClient, HttpHeaders } from '../../../node_modules/@angular/common/http';
import { Observable } from '../../../node_modules/rxjs/Observable';
import { AppConstants } from '../app.constants';
// import { ISMSResponse } from '../model/twitter/sms.gateway.model';
import { ICommonInterface } from '../model/commonInterface.model';
import { Http } from '@angular/http';
import { ISMSResponse } from '../model/sms.gateway.model';

@Injectable()
export class GloblalSmsService {
    constructor(
        private httpService: HttpClient,
        private http: Http,
    ) { }

    public headers: HttpHeaders;
    /**
     * @param client_id this takes client id
     */
    public getSMSSenderIds(client_id: string): Observable<ICommonInterface> {
        return this.httpService.get<ICommonInterface>(`${AppConstants.API_URL}flujo_client_getsmssenderids/${client_id}`);
    }
    /**
     * @param senderIdDetails this takes the object of sender_id and client_id
     */
    public createSenderId(senderIdDetails): Observable<ISMSResponse> {
        return this.httpService.post<ISMSResponse>
            (`${AppConstants.EXPRESS_URL_MAILGUN}smsgateway/createsmssenderid`, senderIdDetails);
    }

    public getCountryCodes(): Observable<any> {
        return this.httpService.get(`${AppConstants.API_URL}flujo_client_countrynames`);
    }
}
