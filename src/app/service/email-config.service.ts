import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppConstants } from '../app.constants';
import { Observable } from 'rxjs/Observable';
import { IDomainDetails, IDomainResponse } from '../model/email.config.model';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class EmailConfigService {

  public headers: HttpHeaders;
  public headersObject: { client_id: string; token_expiry_date: string; feature_name: string; access_token: string };
  public subject = new Subject<IDomainResponse>();
  public smtpDetails: IDomainResponse;
  constructor(
    private httpClient: HttpClient
  ) {
    const feature_access_tokens = JSON.parse(localStorage.getItem('feature_access_tokens'));
    this.headersObject = {
      access_token: feature_access_tokens[1].feature_access_token,
      token_expiry_date: 'feature_access_tokens[1].expiry_date',
      client_id: AppConstants.CLIENT_ID,
      feature_name: feature_access_tokens[1].feature_name
    };

    this.headers = new HttpHeaders(this.headersObject);
  }


  /**
   * this is to create a mailgun domain.
   */
  public createDomain(domainDetails): Observable<IDomainResponse> {
    return this.httpClient.post<IDomainResponse>(
      AppConstants.EXPRESS_URL_LOCAL + 'mailgun/createdomain', domainDetails, { headers: this.headers }
    );
  }

  /**
   * this is to get smtp user details from database
   */
  public getMailgunSmtpDetails(): Observable<IDomainResponse> {
    return this.httpClient.get<IDomainResponse>(
      AppConstants.EXPRESS_URL_LOCAL + 'mailgun/details', { headers: this.headers }
    );
  }

  /**
   * this function adds smtpuser details to the subject to child components
   * @param smtpDetails this takes smtp userdetails as an object
   */
  public addSmtpUserDetails(smtpDetails: IDomainResponse) {
    // if (smtpDetails.error === false) {
    this.smtpDetails = smtpDetails;
    this.subject.next({ ...this.smtpDetails, ...smtpDetails });
    // }
  }

  /**
   * this is to get smtpuser details for child components
   */
  public getSmtpUserDetails(): Observable<IDomainResponse> {
    return this.subject.asObservable();
  }
  /**
   * @param userDetails this takes userdetails like client_id, domain details
   */
  public deleteDomain(userDetails: any): Observable<any> {
    return this.httpClient.post(
      AppConstants.EXPRESS_URL_LOCAL + 'mailgun/deletedomain', userDetails, { headers: this.headers }
    );
  }

}
