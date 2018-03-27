import { Component, OnInit } from '@angular/core';
import { ThemePalette, MatDatepickerInputEvent } from '@angular/material';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../app.constants';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';
import * as _ from 'underscore';
import * as moment from 'moment';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { single, multi, gender } from './data';


@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  timeRange = 'option2';
  isActive = true;
  // color = 'accent';
  colors = ['#ee2f6b','#0cc0df','#fecd0f'];
    // color1 = 'warn';
    // color2 = 'primary';
    // color3 = 'accent';
  mode = 'determinate';
  value = 50;


  //post params for analytics ajax data

  params = {
    client_id: AppConstants.CLIENT_ID,
    from_date: '2000-01-01',
    to_date: '2018-03-31'
  }
  

  AgeData: any = [];

  newData : any = [];
  problem_category : any;
  constructor(public http: HttpClient) { Object.assign(this, { single, multi, gender }) }

  ngOnInit() {
    this.getData(this.params);
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


  onSelect(event) {
    console.log(event);
  }
  /* Chart -2 */
  single: any[];
  multi: any[];

  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Population';

  colorScheme = {
    domain: ['#0cc0df', '#ee2f6b', '#452c59', '#fecd0f']
  };
  /* Chart -2 */
}
