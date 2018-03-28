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

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  timeRange = 'option2';
  isActive = true;
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
  newData: any = [];
  problem_category: any;
  dateCtrl = new FormControl();
  params = {
    client_id: AppConstants.CLIENT_ID,
    from_date: '2000-01-01',
    to_date: '2018-03-31',
    problem_type: ['water', 'power', 'road']
  };
  dateFilter =
      (date: Date) => !(date.getFullYear() % 2) && (date.getMonth() % 2) && !(date.getDate() % 2)

  onDateInput = (e: MatDatepickerInputEvent<Date>) => this.lastDateInput = e.value;
  onDateChange = (e: MatDatepickerInputEvent<Date>) => this.lastDateChange = e.value;
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
      },
      error => {
        console.log(error);
      });
  }


}
