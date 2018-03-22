import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  timeRange = 'option2';
  isActive = true;


  data: any = [
    {id: 1, solved: 10, pending:20, problems: 50, category: 'water'},
    {id: 2, solved: 10, pending:20, problems: 50, category: 'power'},
    {id: 3, solved: 10, pending:20, problems: 50, category: 'sanitation'},
    {id: 4, solved: 10, pending:20, problems: 50, category: 'Drinage'},
    {id: 5, solved: 10, pending:20, problems: 50, category: 'roads'},
    {id: 6, solved: 10, pending:20, problems: 50, category: 'manholes'},
    {id: 7, solved: 10, pending:20, problems: 50, category:"test"},
    {id: 8, solved: 10, pending:20, problems: 50, category:"test"},
    {id: 8, solved: 10, pending:20, problems: 50, category:"test"},
    {id: 8, solved: 10, pending:20, problems: 50, category:"test"},
    {id: 8, solved: 10, pending:20, problems: 50, category:"test"},
    {id: 8, solved: 10, pending:20, problems: 50, category:"test"},
    {id: 8, solved: 10, pending:20, problems: 50, category:"test"},
    {id: 8, solved: 10, pending:20, problems: 50, category:"test"},
  ];
  constructor() { }

  ngOnInit() {
  }
  timeChange = (range) => {
    this.timeRange = range;
    this.isActive = !this.isActive;
  }

  
}
