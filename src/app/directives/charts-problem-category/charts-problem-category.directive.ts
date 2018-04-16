import { Component, OnInit, Input } from '@angular/core';
import Chart from 'chart.js';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';
@Component({
  selector: 'app-charts-problem-category',
  templateUrl: './charts-problem-category.directive.html',
  styleUrls: ['./charts-problem-category.directive.scss']
})
// tslint:disable-next-line:component-class-suffix
export class ChartsProblemCategoryDirective implements OnInit {
  @Input() problem_category: any;
  constructor(public mScrollbarService: MalihuScrollbarService) { }

  ngOnInit() {
    this.mScrollbarService.initScrollbar('.problems', { axis: 'x', theme: 'minimal' });
  }
}
