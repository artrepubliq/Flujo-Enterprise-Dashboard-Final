import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-charts-gender',
  templateUrl: './charts-gender.component.html',
  styleUrls: ['./charts-gender.component.scss']
})
export class ChartsGenderComponent implements OnInit, OnChanges {
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
    }
}
