import { Component, OnInit } from '@angular/core';
import { ThemePalette, MatDatepickerInputEvent } from '@angular/material';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  timeRange = 'option2';
  isActive = true;
  touch: boolean;
  filterOdd: boolean;
  yearView: boolean;
  inputDisabled: boolean;
  datepickerDisabled: boolean;
  minDate: Date;
  maxDate: Date;
  startAt: Date;
  date: Date;
  lastDateInput: Date | null;
  lastDateChange: Date | null;
  color: ThemePalette;

  dateCtrl = new FormControl();

  dateFilter =
      (date: Date) => !(date.getFullYear() % 2) && (date.getMonth() % 2) && !(date.getDate() % 2)

  onDateInput = (e: MatDatepickerInputEvent<Date>) => this.lastDateInput = e.value;
  onDateChange = (e: MatDatepickerInputEvent<Date>) => this.lastDateChange = e.value;
  constructor() { }

  ngOnInit() {
  }
  timeChange = (range) => {
    this.timeRange = range;
    this.isActive = ! this.isActive;
  }

  data: any = [
    {id: 1, solved: 10, pending: 20,problems:50,category:'water'},
    {id: 2, solved: 10, pending: 20, problems:50,category:'power'},
    {id: 3, solved: 10, pending: 20, problems:50,category:'sanitation'},
    {id: 4, solved: 10, pending: 20, problems:50,category:"Drinage"},
    {id: 5, solved: 10, pending: 20, problems:50,category:"roads"},
    {id: 6, solved: 10, pending: 20, problems:50,category:"manholes"},
    {id: 7, solved: 10, pending: 20, problems:50,category:"test"},
    {id: 8, solved: 10, pending: 20, problems:50,category:"test"},
    {id: 8, solved: 10, pending: 20, problems:50,category:"test"},
    {id: 8, solved: 10, pending: 20, problems:50,category:"test"},
    {id: 8, solved: 10, pending: 20, problems:50,category:"test"},
    {id: 8, solved: 10, pending: 20, problems:50,category:"test"},
    {id: 8, solved: 10, pending: 20, problems:50,category:"test"},
    {id: 8, solved: 10, pending: 20, problems:50,category:'test'},
  ];
}
