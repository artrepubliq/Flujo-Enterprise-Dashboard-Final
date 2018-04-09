import { Component, OnInit, Input } from '@angular/core';
import Chart from 'chart.js';
@Component({
  selector: 'app-charts-status',
  templateUrl: './charts-status.directive.html',
  styleUrls: ['./charts-status.directive.scss']
})
// tslint:disable-next-line:component-class-suffix
export class ChartsStatusDirective implements OnInit {
  @Input() status_reports: any;
  colors = ['#ee2f6b', '#0cc0df', '#fecd0f'];
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
