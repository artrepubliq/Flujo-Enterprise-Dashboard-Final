import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AgeDetails } from '../model/analytics.model';
import Chart from 'chart.js';
import * as _ from 'underscore';
import * as moment from 'moment';
import { Router } from '@angular/router';
import * as _ from 'underscore';
import { AdminComponent } from '../admin/admin.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Component({
  selector: 'app-charts-age-pie',
  templateUrl: './charts-age-pie.component.html',
  styleUrls: ['./charts-age-pie.component.scss']
})
export class ChartsAgePieComponent implements OnInit, OnChanges {
  @Input() ageData: any;
  range: any;
  rangeValue: any;
  Chart: any;
  constructor() { }
export class ChartsAgePieComponent implements OnInit {
  filteredUserAccessData: any;
  userAccessLevelObject: any;
 @Input() ageData: AgeDetails;
  multi: any[];
  // view: any[] = [700, 400];

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };


  constructor(public adminComponent: AdminComponent, private spinnerService: Ng4LoadingSpinnerService, private router: Router) {
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
  //   console.log(JSON.stringify(this.ageData));
  //   setTimeout(() => {
  //     console.log(JSON.stringify(this.ageData));
  //     this.range = _.pluck(this.ageData, 'name');
  //     this.rangeValue = _.pluck(this.ageData, 'value');
  //     this.displayChartData(this.range, this.rangeValue);
  // // console.log(range);

  //   }, 3000);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['ageData']) {
      this.range = _.pluck(this.ageData, 'name');
      this.rangeValue = _.pluck(this.ageData, 'value');
      this.displayChartData(this.range, this.rangeValue);
      console.log(JSON.stringify(this.ageData));
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
      this.router.navigate(['/analytics']);
    }else {
      this.router.navigate(['/accessdenied']);
      console.log('else');
    }
  }
  onSelect(event) {
    console.log(event);
  }

    // handle the chart data
    displayChartData(range, rangeValue) {
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
    }
}
