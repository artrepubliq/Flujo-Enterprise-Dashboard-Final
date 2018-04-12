import { Component, OnInit, Input } from '@angular/core';
import Chart from 'chart.js';
@Component({
  selector: 'app-charts-status',
  templateUrl: './charts-status.component.html',
  styleUrls: ['./charts-status.component.scss']
})
export class ChartsStatusComponent implements OnInit {
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
    }, 3000);
  }

}
