import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as Chart from 'chart.js';
import * as _ from 'underscore';

@Component({
  selector: 'app-chart-age',
  templateUrl: './chart-age.directive.html',
  styleUrls: ['./chart-age.directive.scss']
})

// tslint:disable-next-line:component-class-suffix
export class ChartAgeDirective implements OnChanges {
  @Input() ageData: any;
  myAgeChart: any;
  constructor() { }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['ageData']) {

      const range = _.pluck(this.ageData, 'name');
      const rangeValue = _.pluck(this.ageData, 'value');

      let range = _.pluck(this.ageData, 'name');
      let rangeValue = _.pluck(this.ageData, 'value');
      console.log('Age data');

      this.displayChartData(range, rangeValue);
    } else {
      console.log('Age dat not available');
    }
  }

  displayChartData(range, rangeValue) {

    const agectx = document.getElementById('ageChartCanvas');
    const myAgeChart = new Chart(agectx, {
      'type': 'pie',
      'data': {
        datasets: [{
            data: range
        }],
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: rangeValue
      }
    });
    console.log(myAgeChart + 'test on changes');

    console.log("opening");
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
    console.log('test on changes');

    // console.log(this.myDoughnutChart);
  }

}
