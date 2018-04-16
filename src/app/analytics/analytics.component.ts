import { Component, OnInit, SimpleChanges, OnChanges } from '@angular/core';
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
import { AccessDataModelComponent } from '../model/useraccess.data.model';
import { Router } from '@angular/router';
import { ICommonInterface } from '../model/commonInterface.model';
@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})

export class AnalyticsComponent implements OnInit, OnChanges {
  pageTitle = 'Analytics';
  feature_id = 6;
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
  ageData: Array<Object>;
  assign: any;
  area: any;
  range: any;
  // tslint:disable-next-line:member-ordering
  params = {
    client_id: AppConstants.CLIENT_ID,
    from_date: this.minDate,
    to_date: this.maxDate
  };
  userAccessDataModel: AccessDataModelComponent;
  constructor(public http: HttpClient, private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertService, private router: Router) {
      if (Number(localStorage.getItem('feature_id')) !== this.feature_id) {
        this.userAccessDataModel = new AccessDataModelComponent(http, router);
        this.userAccessDataModel.setUserAccessLevels(null , this.feature_id, 'admin/analytics');
       }
     }

  ngOnInit() {
    this.getData(this.params);
    // console.log(moment(this.maxDate).format("YYYY-MM-DD"));
    // console.log(moment(this.minDate).format("YYYY-MM-DD"));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['ageData']) {
      const range = _.pluck(this.ageData, 'name');
      const rangeValue = _.pluck(this.ageData, 'value');
    } else {
      console.log('Age dat not available');
    }
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

  async getProblemsData(params) {
    // tslint:disable-next-line:max-line-length
    await this.http.post<Observable<ICommonInterface>>(AppConstants.API_URL + 'flujo_client_postproblemtypereportanalytics', params)
      .subscribe(
        (data) => {
          console.log(data);
          if (data['error']) {
            console.log('Error getting problems data');
          } else {
            this.problem_category = data['result'];
          }
        },
        (error) => {
          console.log(error);
        });
  }

  async getGenderData(params) {
    await this.http.post<Observable<ICommonInterface>>(AppConstants.API_URL + 'flujo_client_postgenderreportanalytics', params)
      .subscribe(
        (data) => {
          console.log(data);
          if (data['error']) {
            console.log('Error getting Gender data');
          } else {
            this.gender = data['result'][0];
          }
        },
        (error) => {
          console.log(error);
        });
  }

  async getAgeData(params) {
    await this.http.post<Observable<ICommonInterface>>(AppConstants.API_URL + 'flujo_client_postagereportanalytics', params)
      .subscribe(
        (data) => {
          console.log(data);
          if (data['error']) {
            console.log('Error getting Age data');
          } else {
            this.ageData = data['result'];
            this.ageChart();
          }
        },
        (error) => {
          console.log(error);
        });
  }

  async getAreaData(params) {
    await this.http.post<Observable<ICommonInterface>>(AppConstants.API_URL + 'flujo_client_postareareportanalytics', params)
      .subscribe(
        (data) => {
          console.log(data);
          if (data['error']) {
            console.log('Error getting Area data');
          } else {
            this.area = data['result'];
          }
        },
        (error) => {
          console.log(error);
        });
  }

  async getReportsData(params) {
    await this.http.post<Observable<ICommonInterface>>(AppConstants.API_URL + 'flujo_client_poststatusreportanalytics', params)
      .subscribe(
        (data) => {
          console.log(data);
          if (data['error']) {
            console.log('Error getting Status Reports data');
          } else {
            this.status_reports = data['result'];
          }
        },
        (error) => {
          console.log(error);
        });
  }

  async getAssignData(params) {
    await this.http.post<Observable<ICommonInterface>>(AppConstants.API_URL + 'flujo_client_postassignreportanalytics', params)
      .subscribe(
        (data) => {
          console.log(data);
          if (data['error']) {
            console.log('Error getting Assign data');
          } else {
            this.assign = data['result'];
          }
        },
        (error) => {
          console.log(error);
        });
  }

  ageChart() {

    const range = _.pluck(this.ageData, 'name');
    const rangeValue = _.pluck(this.ageData, 'value');
    const agectx = document.getElementById('ageChartCanvas');
        const ageChart = new Chart(agectx, {
          'type': 'doughnut',
          'data': {
            datasets: [{
              data: rangeValue,
              backgroundColor: [
                '#0cc0df', '#ee2f6b', '#fecd0f', '#452c59'
              ]
            }],
            labels: range
          },
          'options': {
            legend: {
              display: false
            }
          }
        });
  }

  getData(params) {
    this.getProblemsData(params);
    this.getGenderData(params);
    this.getAgeData(params);
    this.getAreaData(params);
    this.getReportsData(params);
    this.getAssignData(params);
    this.spinnerService.hide();
  }

}
