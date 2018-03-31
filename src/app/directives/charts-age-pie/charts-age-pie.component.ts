import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AgeDetails } from '../../model/analytics.model';
import Char from 'chart.js';
import * as _ from 'underscore';
import * as moment from 'moment';



@Component({
  selector: 'app-charts-age-pie',
  templateUrl: './charts-age-pie.component.html',
  styleUrls: ['./charts-age-pie.component.scss']
})
export class ChartsAgePieComponent implements OnInit, OnChanges {
  @Input() ageData: any;
  // range: any;
  // rangeValue: any;
  // Chart: any;
  constructor() { }

  ngOnInit() {
     console.log(JSON.stringify(this.ageData));
  setTimeout(() => {
       console.log(JSON.stringify(this.ageData));
       const range = _.pluck(this.ageData, 'name');
       const rangeValue = _.pluck(this.ageData, 'value');
       this.displayChartData(range, rangeValue);
   console.log(range);

     }, 3000);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['ageData']) {
      const range = _.pluck(this.ageData, 'name');
      const rangeValue = _.pluck(this.ageData, 'value');
      this.displayChartData(range, rangeValue);
      console.log(JSON.stringify(this.ageData));
    }
  }

    // handle the chart data
    displayChartData(range, rangeValue) {
      // Age Chart
      const agectx = document.getElementById('ageChartCanvas');
      const ageChart = new Char(agectx, {
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
