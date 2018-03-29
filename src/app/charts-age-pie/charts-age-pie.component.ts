import { Component, OnInit, Input } from '@angular/core';
import { AgeDetails } from '../model/analytics.model';
import { Chart } from 'chart.js';
import * as _ from 'underscore';
import * as moment from 'moment';

@Component({
  selector: 'app-charts-age-pie',
  templateUrl: './charts-age-pie.component.html',
  styleUrls: ['./charts-age-pie.component.scss']
})
export class ChartsAgePieComponent implements OnInit {
 @Input() ageData: any;

 range = _.pluck(this.ageData, 'name');
 rangeValue = _.pluck(this.ageData, 'value');
 // console.log(range);

  constructor() { }

  ngOnInit() {
    //console.log(JSON.stringify(this.ageData));

    // Age Chart
    const agectx = document.getElementById('ageChartCanvas');
    const ageChart = new Chart(agectx, {
      'type': 'doughnut',
      'data': {
        datasets: [{
          data: this.rangeValue,
          backgroundColor: [
            '#0cc0df', '#ee2f6b', '#fecd0f', '#452c59'
          ]
        }],
        labels: this.range
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
