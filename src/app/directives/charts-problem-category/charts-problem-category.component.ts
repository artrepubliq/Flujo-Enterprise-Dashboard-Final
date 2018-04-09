import { Component, OnInit, Input } from '@angular/core';
import Chart from 'chart.js';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';
@Component({
  selector: 'app-charts-problem-category',
  templateUrl: './charts-problem-category.component.html',
  styleUrls: ['./charts-problem-category.component.scss']
})
export class ChartsProblemCategoryComponent implements OnInit {
  @Input() problem_category: any;
  constructor(public mScrollbarService: MalihuScrollbarService) { }

  ngOnInit() {
    this.mScrollbarService.initScrollbar('.problems', { axis: 'x', theme: 'minimal' });
  }
}
