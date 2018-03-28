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
  minDate = new Date(1990, 1, 1);
  maxDate = new Date();
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
  gender : any = {};
  ageData : any;
  assign : any;
  area : any;
  constructor(public http: HttpClient) { }

  ngOnInit() {
    this.getData(this.params);
    console.log(this.maxDate);
  }

  getData(params) {
    this.http.post<Observable<any[]>>('http://www.flujo.in/dashboard/flujo.in_api_client/flujo_client_postreportanalytics', params)
    .subscribe(
      response => {
        console.log(JSON.stringify(response));
        this.newData = response;
        this.problem_category = this.newData[0].problem_category;
        this.status_reports = this.newData[4].report_status;
        //Gender related
        this.gender.female = this.newData[1].gender[0].female;
        this.gender.male = this.newData[1].gender[0].male;
        //End of Gender related

        //Area related
        this.area = this.newData[3].area;
        const areaName = _.pluck(this.area,'name');
        const areaValue = _.pluck(this.area,'value');
        //console.log(areaValue);
        //End of Area related

        //Age related
        this.ageData = this.newData[2].age;
        const range = _.pluck(this.ageData,'name');
        const rangeValue = _.pluck(this.ageData,'value');
        //console.log(range);
        //End of Age related


        this.assign = this.newData[5].assign;
        const assignID = _.pluck(this.assign,'id');
        const assignName = _.pluck(this.assign,'name');
        const assignEmail = _.pluck(this.assign,'email');
        const assignCompleted = _.pluck(this.assign,'completed');
        const assignInProgress = _.pluck(this.assign,'in_progress');
        const assignUnresolved = _.pluck(this.assign,'unresolved');

        //console.log(JSON.stringify(this.gender));

        // Gender Chart
        const ctx = document.getElementById("genderChartCanvas");
        const genderChart = new Chart(ctx, {
          'type': 'pie',
          'data': {
            datasets: [{
              data: [this.gender.female,this.gender.male]
            }],
            labels: ['Female','Male']
          },
          'options': {
            legend: {
              display: false
            }
          }
        });
        // End of Gender Chart

        //Age Chart
        const agectx = document.getElementById("ageChartCanvas");
        const ageChart = new Chart(agectx, {
          'type': 'doughnut',
          'data': {
            datasets: [{
              data: rangeValue
            }],
            labels: range
          },
          'options': {
            legend: {
              display: false
            }
          }
        });
        //End of Age Chart

        //Area Chart
        const areactx = document.getElementById("areaChartCanvas");
        const areaChart = new Chart(areactx, {
          'type': 'bar',
          'data': {
            datasets: [{
              data: areaValue
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
        //End of Area Chart

        //Assign Chart
        const assignctx = document.getElementById("assignChartCanvas");
        const assignChart = new Chart(assignctx, {
          'type': 'bar',
          'data': {
            datasets: [
              {
              data: assignCompleted
              },
              {
                data: assignInProgress
              },
              {
                data: assignUnresolved
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
        //End of Assign Chart
      },
      error => {
        console.log(error);
      });
  }

  

}
