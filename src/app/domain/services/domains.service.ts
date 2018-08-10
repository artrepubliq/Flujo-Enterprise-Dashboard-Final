import { Injectable } from '@angular/core';
import { ICommonInterface } from '../../model/commonInterface.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AppConstants } from '../../app.constants';

@Injectable()
export class DomainsService {

  constructor(private httpClient: HttpClient) { }

  public getListOfDomains(client_id: string): Observable<ICommonInterface> {
    return this.httpClient.get<ICommonInterface>(`${AppConstants.DOMAINS_API_URL}domains/${client_id}`);
  }
}
