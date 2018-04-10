import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as Chart from 'chart.js';
import * as _ from 'underscore';

@Component({
  selector: 'app-charts-assign',
  templateUrl: './charts-assign.directive.html',
  styleUrls: ['./charts-assign.directive.scss']
})
// tslint:disable-next-line:component-class-suffix
export class ChartsAssignDirective implements OnChanges {
  @Input() assign: any;
  assignChart: any;
  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['assign']) {
      const assignID = _.pluck(this.assign, 'id');
        const assignName = _.pluck(this.assign, 'name');
        const assignEmail = _.pluck(this.assign, 'email');
        const assignCompleted = _.pluck(this.assign, 'completed');
        const assignInProgress = _.pluck(this.assign, 'in_progress');
        const assignUnresolved = _.pluck(this.assign, 'unresolved');
        // console.log(assignCompleted);
      this.displayChartData(assignCompleted, assignInProgress, assignUnresolved, assignEmail);
    }
  }

  // handle the chart data
  displayChartData(assignCompleted, assignInProgress, assignUnresolved, assignEmail) {
    // Assign Chart
    const assignctx = document.getElementById('assignChartCanvas');
    const assignChart = new Chart(assignctx, {
      'type': 'bar',
      'data': {
        datasets: [
          {
          data: assignCompleted,
          backgroundColor: [
            '#ee2f6b', '#ee2f6b', '#ee2f6b'

          ]

          ],
          label: 'Completed'

          },
          {
            data: assignInProgress,
            backgroundColor: [

              '#ee2f6b', '#ee2f6b', '#ee2f6b'
            ]

              '#00f', '#00f', '#00f'
            ],
            label: 'In Progress'

          },
          {
            data: assignUnresolved,
            backgroundColor: [

              '#ee2f6b80', '#ee2f6b80', '#ee2f6b80'
            ]

              '#0f0', '#0f0', '#0f0'
            ],
            label: 'Unresolved'

          }
        ],
        labels: assignEmail
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
    // End of Assign Chart
  }

}
