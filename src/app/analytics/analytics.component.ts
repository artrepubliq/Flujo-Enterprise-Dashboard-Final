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
import { AdminComponent } from '../admin/admin.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Router } from '@angular/router';
import { AlertService } from 'ngx-alerts';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})

export class AnalyticsComponent implements OnInit {

  filteredUserAccessData: any;
  userAccessLevelObject: any;
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
  constructor(public http: HttpClient, public adminComponent: AdminComponent, private spinnerService: Ng4LoadingSpinnerService,
  private router: Router) {
    if (this.adminComponent.userAccessLevelData) {
      console.log(this.adminComponent.userAccessLevelData[0].name);
      this.userRestrict();
    } else {
      this.adminComponent.getUserAccessLevelsHttpClient()
        .subscribe(
          resp => {
            console.log(resp);
            this.spinnerService.hide();
            _.each(resp, item => {
              if (item.user_id === localStorage.getItem('user_id')) {
                  this.userAccessLevelObject = item.access_levels;
              }else {
                // this.userAccessLevelObject = null;
              }
            });
            this.adminComponent.userAccessLevelData = JSON.parse(this.userAccessLevelObject);
            this.userRestrict();
          },
          error => {
            console.log(error);
            this.spinnerService.hide();
          }
        );
    }
  }

  ngOnInit() {
    this.getData(this.params);
    // console.log(moment(this.maxDate).format("YYYY-MM-DD"));
    // console.log(moment(this.minDate).format("YYYY-MM-DD"));
  }
  userRestrict() {
    _.each(this.adminComponent.userAccessLevelData, (item, iterate) => {
      // tslint:disable-next-line:max-line-length
      if (this.adminComponent.userAccessLevelData[iterate].name === 'Analytics' && this.adminComponent.userAccessLevelData[iterate].enable) {
        this.filteredUserAccessData = item;
      } else {
        // this.router.navigate(['/accessdenied']);
        // console.log('else');
      }
    });
    if (this.filteredUserAccessData) {
      this.router.navigate(['admin/analytics']);
    }else {
      this.router.navigate(['/accessdenied']);
      console.log('else');
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
        const assignID = _.pluck(this.assign, 'id');
        const assignName = _.pluck(this.assign, 'name');
        const assignEmail = _.pluck(this.assign, 'email');
        const assignCompleted = _.pluck(this.assign, 'completed');
        const assignInProgress = _.pluck(this.assign, 'in_progress');
        const assignUnresolved = _.pluck(this.assign, 'unresolved');

        // console.log(JSON.stringify(this.gender));

        // Gender Chart
        const ctx = document.getElementById('genderChartCanvas');
        const genderChart = new Chart(ctx, {
          'type': 'pie',
          'data': {
            datasets: [{
              data: [this.gender.female, this.gender.male],
              backgroundColor: [
                '#ee2f6b', '#0cc0df'
              ]
            }],
            labels: ['Female', 'Male']
          },
          'options': {
            legend: {
              display: false
            }
          }
        });
        // End of Gender Chart

        // Age Chart
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
        // End of Age Chart

        // Area Chart
        const areactx = document.getElementById('areaChartCanvas');
        const areaChart = new Chart(areactx, {
          'type': 'bar',
          'data': {
            datasets: [{
              data: areaValue,
              backgroundColor: [
                '#ee2f6b', '#ee2f6b', '#ee2f6b'
              ],
              barPercentage: [
                '10'
              ]
            }],
            labels: areaName
          },
          'options': {
            legend: {
              display: false
            },
            scales: {
              yAxes: [{
                  ticks: {
                    beginAtZero: true,
                      stepSize: 1
                  }
              }]
          }
          }
        });
        // End of Area Chart

        // Assign Chart
        const assignctx = document.getElementById('assignChartCanvas');
        const assignChart = new Chart(assignctx, {
          'type': 'bar',
          'data': {
            datasets: [
              {
              data: assignCompleted,
              backgroundColor: [
                '#ee2f6b', '#ee2f6b', '#ee2f6b', '#ee2f6b'
              ]
              },
              {
                data: assignInProgress,
                backgroundColor: [
                  '#ee2f6b', '#ee2f6b', '#ee2f6b', '#ee2f6b'
                ]
              },
              {
                data: assignUnresolved,
                backgroundColor: [
                  '#ee2f6b80', '#ee2f6b80', '#ee2f6b80', '#ee2f6b80'
                ]
              }
            ],
            labels: assignID
          },
          'options': {
            legend: {
              display: false
            },
            scales: {
              yAxes: [{
                  ticks: {
                    beginAtZero: true
                  }
              }]
          }
          }
        });
        // End of Assign Chart
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
