import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as Chart from 'chart.js';
import * as _ from 'underscore';

@Component({
  selector: 'app-chart-age',
  templateUrl: './chart-age.component.html',
  styleUrls: ['./chart-age.component.scss']
})
export class ChartAgeComponent implements OnChanges {
  @Input() ageData: any;
  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['ageData']) {
      // console.log(this.ageData);
      const range = _.pluck(this.ageData, 'name');
      const rangeValue = _.pluck(this.ageData, 'value');
      console.log(range, rangeValue);

      this.displayChartData();
    }
  }

  displayChartData() {
    const agectx = document.getElementById('ageChartCanvas');
    const myDoughnutChart = new Chart(agectx, {
      'type': 'pie',
      'data': {
        datasets: [{
            data: [10, 20, 30]
        }],
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: [
            'Red',
            'Yellow',
            'Blue'
        ]
      }
    });
  }

}
