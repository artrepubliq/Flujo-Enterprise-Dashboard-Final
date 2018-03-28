import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';
import { Params } from '../model/analytics.model';

@Injectable()
export class AnalyticsService {

  constructor(private http: HttpClient) { }

  getData(params: Params) {
    return this.http.post('http://www.flujo.in/dashboard/flujo.in_api_client/flujo_client_postreportanalytics', params);
  }
}
