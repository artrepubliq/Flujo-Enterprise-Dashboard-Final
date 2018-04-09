import { Component, OnInit, Input } from '@angular/core';
import Chart from 'chart.js';
@Component({
  selector: 'app-charts-problem-category',
  templateUrl: './charts-problem-category.directive.html',
  styleUrls: ['./charts-problem-category.directive.scss']
})
// tslint:disable-next-line:component-class-suffix
export class ChartsProblemCategoryDirective implements OnInit {
  @Input() problem_category: any;
  constructor() { }

  ngOnInit() {
  }
}
