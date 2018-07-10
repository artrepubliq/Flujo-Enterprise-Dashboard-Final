import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppConstants } from '../app.constants';
import { Observable } from 'rxjs/Observable';
import { IDomainResponse, ICreateCampaign, IDeleteDomain, ICampaignDetails, ICampaignListDetails } from '../model/email.config.model';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class EmailConfigService {

  public headers: HttpHeaders;
  public headersObject: { client_id: string; token_expiry_date: string; feature_name: string; access_token: string };
  public subject = new Subject<IDomainResponse>();
  public campaignSubject = new Subject<ICampaignListDetails[]>();
  public smtpDetails: IDomainResponse;
  public campaignDetails: ICampaignListDetails[];
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
  public createDomain(domainDetails: { domain_name: string }): Observable<IDomainResponse> {
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
  public deleteDomain(userDetails: IDeleteDomain): Observable<IDomainResponse> {
    return this.httpClient.post<IDomainResponse>(
      AppConstants.EXPRESS_URL_LOCAL + 'mailgun/deletedomain', userDetails, { headers: this.headers }
    );
  }
  /**
   * @param campaignDetails takes below values
   * @param name mailing list name
   * @param address mailing list email id
   * @param description mailing list description
   */
  public createCampaign(campaignDetails: ICreateCampaign): Observable<IDomainResponse> {
    return this.httpClient.post<IDomainResponse>(
      AppConstants.EXPRESS_URL_LOCAL + 'mailgun/createmailinglist', campaignDetails, { headers: this.headers }
    );
  }
  /**
   * this is a service to get campaign details from database
   */
  public getCampainDetailsOfClient(): Observable<IDomainResponse> {
    return this.httpClient.get<IDomainResponse>(
      AppConstants.EXPRESS_URL_LOCAL + 'mailgun/mycampaigns', { headers: this.headers }
    );
  }

  /**
   * this adds the campaign details to a subject
   * @param campaignDetails[] it contains the array of campaign details
   */
  public addCampaignDetails(campaignDetails: ICampaignListDetails[]) {
    if (this.campaignDetails !== undefined) {
      this.campaignDetails = [...this.campaignDetails, ...campaignDetails];
      this.campaignDetails = Object.values(this.campaignDetails.reduce((cum, val) => Object.assign(cum, { [val.address]: val }), {}));
    } else {
      this.campaignDetails = campaignDetails;
    }

    // console.log(result, 115);
    console.log(this.campaignDetails, 116);
    this.campaignSubject.next(this.campaignDetails);
  }
  /**
   * this returns the campaign details as an observable
   */
  public getCampaignDetails(): Observable<ICampaignListDetails[]> {
    return this.campaignSubject.asObservable();
  }

  /**
   * @param emailDetails it has email details object
   */
  public sendEmail(emailDetails: any): Observable<any> {
    return this.httpClient.post<Observable<any>>(
      AppConstants.EXPRESS_URL_LOCAL + 'mailgun/sendemail', emailDetails, { headers: this.headers }
    );
  }

  public addMembersToACampaign(memberslist: any): Observable<IDomainResponse> {
    return this.httpClient.post<IDomainResponse>(
      AppConstants.EXPRESS_URL_LOCAL + 'mailgun/addmembers', memberslist, { headers: this.headers }
    );
  }

}
