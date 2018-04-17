import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
// import { Chart } from 'Chart.js';
import * as _ from 'underscore';
import {Chart} from 'chart.js'; // grabs bundled


@Component({
  selector: 'app-charts-loyality',
  templateUrl: './charts-loyality.directive.html',
  styleUrls: ['./charts-loyality.directive.scss']
})
// tslint:disable-next-line:component-class-suffix
export class ChartsLoyalityDirective implements OnInit, OnChanges {
  @Input() area: any;
  areaChart: any;
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['area']) {
      const areaName = _.pluck(this.area, 'name');
      const areaValue = _.pluck(this.area, 'value');
      this.displayChartData(areaName, areaValue);
    }
  }

  // handle the chart data
  displayChartData(areaName, areaValue) {
    const count = areaValue.length;
    const colors = [];
    const color = '#ee2f6b';
    for ( let i = 0; i < count; i++) {
        colors[i] = color;
    }
    console.log(_.max(areaValue));
    const barRange = Math.ceil(Math.max(areaValue) / areaValue.length);

    // Area Chart
    const areactx = document.getElementById('areaChartCanvas');
    const areaChart = new Chart(areactx, {
      'type': 'bar',
      'data': {
        datasets: [{
          data: areaValue,
          backgroundColor: colors ,
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
                  stepSize: barRange
              }
          }]
      }
      }
    });
    // End of Area Chart
  }

}