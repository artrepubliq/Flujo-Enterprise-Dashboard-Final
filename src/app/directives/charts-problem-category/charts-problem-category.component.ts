import { Component, OnInit, Input } from '@angular/core';
import Chart from 'chart.js';
@Component({
  selector: 'app-charts-problem-category',
  templateUrl: './charts-problem-category.component.html',
  styleUrls: ['./charts-problem-category.component.scss']
})
export class ChartsProblemCategoryComponent implements OnInit {
  @Input() problem_category: any;
  constructor() { }

  ngOnInit() {
  }
}
