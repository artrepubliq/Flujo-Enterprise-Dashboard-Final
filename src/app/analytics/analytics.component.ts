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

  // color = 'accent';
  colors = ['#ee2f6b','#0cc0df','#fecd0f'];
    // color1 = 'accent';
    // color2 = 'primary';
    // color3 = 'warn';
  mode = 'determinate';
  value = 5;

  touch: boolean;
  filterOdd: boolean;
  yearView: boolean;
  inputDisabled: boolean;
  datepickerDisabled: boolean;
  minDate: Date;
  maxDate: Date;
  startAt: Date;
  date: Date;
  lastDateInput: Date | null;
  lastDateChange: Date | null;
  color: ThemePalette;

  dateCtrl = new FormControl();


  dateFilter =
      (date: Date) => !(date.getFullYear() % 2) && (date.getMonth() % 2) && !(date.getDate() % 2)

  onDateInput = (e: MatDatepickerInputEvent<Date>) => this.lastDateInput = e.value;
  onDateChange = (e: MatDatepickerInputEvent<Date>) => this.lastDateChange = e.value;
  

  timeChange = (range) => {
    this.timeRange = range;
    this.isActive = ! this.isActive;
  }
  // tslint:disable-next-line:member-ordering
  params = {
    client_id: AppConstants.CLIENT_ID,
    from_date: '2000-01-01',
    to_date: '2018-03-31',
    problem_type: ['water', 'power', 'road']
  };

  newData : any = [];
  problem_category : any;
  status_reports : any;
  gender : any;
  age : any;
  assign : any;
  area : any;
  constructor(public http: HttpClient) { Object.assign(this, { single, multi, gender }) }

  ngOnInit() {
    this.getData(this.params);
  }

  getData(params) {
    this.http.post<Observable<any[]>>('http://www.flujo.in/dashboard/flujo.in_api_client/flujo_client_postreportanalytics', params)
    .subscribe(
      response => {
        console.log(JSON.stringify(response));
        this.newData = response;
        this.problem_category = this.newData[0].problem_category;
        this.status_reports = this.newData[4].report_status;
        this.gender = this.newData[1].gender;
        this.area = this.newData[2].area;
        this.age = this.newData[3].age;
        this.assign = this.newData[5].assign;
        // console.log(JSON.stringify(this.problem_category));
        // console.log(JSON.stringify(this.status_reports));
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
