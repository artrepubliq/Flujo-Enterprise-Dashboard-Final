import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AppConstants } from '../app.constants';
import { Observable } from 'rxjs/Observable';
import { IDomainResponse, ICreateCampaign, IDeleteDomain, ICampaignDetails, ICampaignListDetails } from '../model/email.config.model';
import { Subject } from 'rxjs/Subject';
import { ICommonInterfaceNode } from '../model/commonInterface.model';
import { IFeatureAccessTokens } from '../model/featureAccessTokens.model';

@Injectable()
export class EmailConfigService {

  public headers: HttpHeaders;
  public headersObject: { client_id: string; token_expiry_date?: string; feature_name?: string; access_token?: string };
  public subject = new Subject<IDomainResponse>();
  public campaignSubject = new Subject<ICampaignListDetails[]>();
  public smtpDetails: IDomainResponse;
  public campaignDetails: ICampaignListDetails[];
  public campaignAddressSubject = new Subject<string>();

  constructor(
    private httpClient: HttpClient
  ) {
    // tslint:disable-next-line:max-line-length
    const feature_access_tokens: IFeatureAccessTokens[] = JSON.parse(localStorage.getItem('feature_access_tokens'));
    const mailgunTokens: IFeatureAccessTokens = feature_access_tokens.find((feature) => feature.feature_name === 'mailgun');
    if (mailgunTokens) {
      this.headersObject = {
        access_token: mailgunTokens.feature_access_token,
        token_expiry_date: mailgunTokens.expiry_date,
        client_id: AppConstants.CLIENT_ID,
        feature_name: mailgunTokens.feature_name
      };
    } else {
      this.headersObject = {
        client_id: AppConstants.CLIENT_ID,
      };
    }

    this.headers = new HttpHeaders(this.headersObject);
  }


  /**
   * this is to create a mailgun domain.
   */
  public createDomain(domainDetails: { domain_name: string }): Observable<IDomainResponse> {
    return this.httpClient.post<IDomainResponse>(
      AppConstants.EXPRESS_URL_MAILGUN + 'mailgun/createdomain', domainDetails, { headers: this.headers }
    );
  }
  /**
   * this is to create domian for third party domains
   */
  public createDomainThirdparty(domainDetails: { domain_name: string }): Observable<IDomainResponse> {
    return this.httpClient.post<IDomainResponse>(
      AppConstants.EXPRESS_URL_MAILGUN + 'mailgun/createdomainthirdparty', domainDetails, { headers: this.headers }
    );
  }

  /**
   * this is to get smtp user details from database
   */
  public getMailgunSmtpDetails(): Observable<IDomainResponse> {
    return this.httpClient.get<IDomainResponse>(
      AppConstants.EXPRESS_URL_MAILGUN + 'mailgun/details', { headers: this.headers }
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
      AppConstants.EXPRESS_URL_MAILGUN + 'mailgun/deletedomain', userDetails, { headers: this.headers }
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
      AppConstants.EXPRESS_URL_MAILGUN + 'mailgun/createmailinglist', campaignDetails, { headers: this.headers }
    );
  }
  /**
   * this is a service to get campaign details from database
   */
  public getCampainDetailsOfClient(): Observable<IDomainResponse> {
    return this.httpClient.get<IDomainResponse>(
      AppConstants.EXPRESS_URL_MAILGUN + 'mailgun/mycampaigns', { headers: this.headers }
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
    this.campaignSubject.next(this.campaignDetails);
  }
  /**
   * this returns the campaign details as an observable
   */
  public getCampaignDetails(): Observable<ICampaignListDetails[]> {
    return this.campaignSubject.asObservable();
  }
  /**
   * @param campaignAddres this takes campaign adderss as string
   */
  public addCampaignAddress(campaignAddres: string): void {
    this.campaignAddressSubject.next(campaignAddres);
  }
  /**
   * this returns the campain address as observable
   */
  public getCampaignAddress(): Observable<String> {
    return this.campaignAddressSubject.asObservable();
  }

  /**
   * @param emailDetails it has email details object
   */
  public sendEmail(emailDetails: any): Observable<any> {
    return this.httpClient.post<Observable<any>>(
      AppConstants.EXPRESS_URL_MAILGUN + 'mailgun/sendemail', emailDetails, { headers: this.headers }
    );
  }

  public addMembersToACampaign(memberslist: any): Observable<IDomainResponse> {
    return this.httpClient.post<IDomainResponse>(
      AppConstants.EXPRESS_URL_MAILGUN + 'mailgun/addmembers', memberslist, { headers: this.headers }
    );
  }

  /**
   * this is a service to get registerd domains in mailgun
   */
  public getRegisteredMailgunDomains(client_id: string): Observable<ICommonInterfaceNode> {
    return this.httpClient.get<ICommonInterfaceNode>(`${AppConstants.EXPRESS_URL_MAILGUN}mailgun/registereddomains/${client_id}`);
  }

}
