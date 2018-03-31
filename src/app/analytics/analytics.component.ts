import { Component, OnInit } from '@angular/core';
import { ThemePalette, MatDatepickerInputEvent } from '@angular/material';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../app.constants';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';
import { Chart } from 'chart.js';
import * as _ from 'underscore';
import * as moment from 'moment';
import { AlertService } from 'ngx-alerts';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})

export class AnalyticsComponent implements OnInit {

  isActive = true;
  // color = 'accent';
  colors = ['#ee2f6b', '#0cc0df', '#fecd0f'];
   mode = 'determinate';
  value = 50;
  touch: boolean;
  filterOdd: boolean;
  yearView: boolean;
  inputDisabled: boolean;
  datepickerDisabled: boolean;
  minDate: any = moment('1990-01-01').format('YYYY-MM-DD');
  maxDate: any = moment(new Date()).format('YYYY-MM-DD');
  startAt: Date;
  date: Date;
  lastDateInput: Date | null;
  lastDateChange: Date | null;
  color: ThemePalette;
  newData: any = [];
  problem_category: any;
  dateCtrl = new FormControl();
  status_reports: any;
  gender: any = {};
  ageData: any;
  assign: any;
  area: any;

  // tslint:disable-next-line:member-ordering
  params = {
    client_id: AppConstants.CLIENT_ID,
    from_date: this.minDate,
    to_date: this.maxDate
  };

  constructor(public http: HttpClient, private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.getData(this.params);
    // console.log(moment(this.maxDate).format("YYYY-MM-DD"));
    // console.log(moment(this.minDate).format("YYYY-MM-DD"));
  }

  onValueChange() {
    // console.log(moment(this.maxDate).format("YYYY-MM-DD"));
    // console.log(moment(this.minDate).format("YYYY-MM-DD"));
    this.minDate = moment(this.minDate).format('YYYY-MM-DD');
    this.maxDate = moment(this.maxDate).format('YYYY-MM-DD');

    this.params.from_date = this.minDate;
    this.params.to_date = this.maxDate;

    this.getData(this.params);
  }

  onToday() {
    this.minDate = moment(new Date()).format('YYYY-MM-DD');
    this.maxDate = moment(new Date()).format('YYYY-MM-DD');

    this.params.from_date = this.minDate;
    this.params.to_date = this.maxDate;

    this.getData(this.params);
  }

  onWeek() {
    this.minDate = moment(new Date()).subtract(7, 'd').format('YYYY-MM-DD');
    this.maxDate = moment(new Date()).format('YYYY-MM-DD');

    this.params.from_date = this.minDate;
    this.params.to_date = this.maxDate;

    this.getData(this.params);
  }

  onMonth() {
    this.minDate = moment(new Date()).subtract(1, 'months').format('YYYY-MM-DD');
    this.maxDate = moment(new Date()).format('YYYY-MM-DD');

    this.params.from_date = this.minDate;
    this.params.to_date = this.maxDate;

    this.getData(this.params);
  }

  onQuarter () {
    this.minDate = moment(new Date()).subtract(3, 'months').format('YYYY-MM-DD');
    this.maxDate = moment(new Date()).format('YYYY-MM-DD');

    this.params.from_date = this.minDate;
    this.params.to_date = this.maxDate;

    this.getData(this.params);
  }

  onYear() {
    this.minDate = moment(new Date()).subtract(1, 'year').format('YYYY-MM-DD');
    this.maxDate = moment(new Date()).format('YYYY-MM-DD');

    this.params.from_date = this.minDate;
    this.params.to_date = this.maxDate;

    this.getData(this.params);
  }

  getData(params) {
    this.spinnerService.show();
    console.log(JSON.stringify(params));
    this.http.post<Observable<any[]>>('http://www.flujo.in/dashboard/flujo.in_api_client/flujo_client_postreportanalytics', params)
    .subscribe(
      response => {
        console.log(JSON.stringify(response));
        this.newData = response;
        this.problem_category = this.newData[0].problem_category;
        this.status_reports = this.newData[4].report_status;
        // Gender related
        this.gender = {
          male: this.newData[1].gender[0].male,
          female: this.newData[1].gender[0].female
        };
        // console.log(this.gender);
        // End of Gender related
        // Area related
        this.area = this.newData[3].area;
        // console.log(areaValue);
        // End of Area related
        // Age related
        this.ageData = this.newData[2].age;
        console.log(this.ageData);
        // End of Age related

        this.assign = this.newData[5].assign;
        this.spinnerService.hide();
        this.alertService.success('Updated');
      },
      error => {
        this.spinnerService.hide();
        this.alertService.warning('Something went wrong');
        console.log(error);
      });
  }
}