import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as Chart from 'chart.js';
import * as _ from 'underscore';

@Component({
  selector: 'app-charts-assign',
  templateUrl: './charts-assign.component.html',
  styleUrls: ['./charts-assign.component.scss']
})
export class ChartsAssignComponent implements OnChanges {
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
          ],
          label: 'Completed'
          },
          {
            data: assignInProgress,
            backgroundColor: [
              '#00f', '#00f', '#00f'
            ],
            label: 'In Progress'
          },
          {
            data: assignUnresolved,
            backgroundColor: [
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
