import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-charts-gender',
  templateUrl: './charts-gender.directive.html',
  styleUrls: ['./charts-gender.directive.scss']
})
// tslint:disable-next-line:component-class-suffix
export class ChartsGenderDirective implements OnInit, OnChanges {
  @Input() gender: any;
  genderChart: any;

  constructor() { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['gender']) {
      this.displayChartData(this.gender);
    }
  }
    // handle the chart data
    displayChartData(gender) {
      // Gender Chart
      const ctx = document.getElementById('genderChartCanvas');
      const genderChart = new Chart(ctx, {
        'type': 'pie',
        'data': {
          datasets: [{
            data: [this.gender.female, this.gender.male],
            backgroundColor: [
              '#ee2f6b', '#0cc0df'
            ],
            borderColor: [
              '#ee2f6b', '#0cc0df'
            ]
          }],
          labels: ['Female', 'Male']
        },
        'options': {
          legend: {
            display: false
          },
          cutoutPercentage: [
            95
          ]
        }
      });
      // End of Gender Chart
    }
}
