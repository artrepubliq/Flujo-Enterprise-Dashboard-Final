import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../app.constants';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';
import * as _ from 'underscore';
import * as moment from 'moment';


@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  timeRange = 'option2';
  isActive = true;

  //post params for analytics ajax data
  params = {
    client_id: AppConstants.CLIENT_ID,
    from_date: '2000-01-01',
    to_date: '2018-03-31'
  }
  
  AgeData: any = [];
  newData : any = [];
  problem_category : any;
  constructor(public http: HttpClient) { }

  ngOnInit() {
    this.getData(this.params);
  }
  timeChange = (range) => {
    this.timeRange = range;
    this.isActive = !this.isActive;
  }


  getData(params) {
    this.http.post<Observable<any[]>>('http://www.flujo.in/dashboard/flujo.in_api_client/flujo_client_postreportanalytics', params)
    .subscribe(
      response => {
        console.log(response);
        this.newData = response;
        this.problem_category = this.newData[0].problem_category;
        console.log(JSON.stringify(this.problem_category));
        this.AgeData = this.newData[2].age;
        console.log(JSON.stringify(this.AgeData));
      },
      error => {
        console.log(error);
      });
  }


}
