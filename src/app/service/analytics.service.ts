import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AnalyticsService {

  constructor(private http:HttpClient) { }

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
