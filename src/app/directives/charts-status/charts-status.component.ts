import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import Chart from 'chart.js';
@Component({
  selector: 'app-charts-status',
  templateUrl: './charts-status.component.html',
  styleUrls: ['./charts-status.component.scss']
})
export class ChartsStatusComponent implements OnInit, OnChanges {
  progressBarUnresolved: number;
  progressBarInProgress: number;
  progressBarCompleted: number;
  @Input() status_reports: any;
  colors = ['#ee2f6b', '#0cc0df', '#fecd0f', '#999999'];
    // color1 = 'warn';
    // color2 = 'primary';
    // color3 = 'accent';
  constructor() { }

  ngOnInit() {
    console.log(JSON.stringify(this.status_reports));
    setTimeout(() => {
      console.log(JSON.stringify(this.status_reports));
      this.calculationsForStatusBar();
    }, 3000);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['status_reports']) {
      this.calculationsForStatusBar();
    }
  }

  calculationsForStatusBar() {
    this.progressBarCompleted = (+this.status_reports[0].completed) / (+this.status_reports[0].total) * 100;
    this.progressBarInProgress = (+this.status_reports[0].in_progress) / (+this.status_reports[0].total) * 100;
    this.progressBarUnresolved = (+this.status_reports[0].unresolved) / (+this.status_reports[0].total) * 100;
  }

}
