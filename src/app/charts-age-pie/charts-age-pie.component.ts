import { Component, OnInit } from '@angular/core';
import {NgxChartsModule} from '@swimlane/ngx-charts';

@Component({
  selector: 'app-charts-age-pie',
  templateUrl: './charts-age-pie.component.html',
  styleUrls: ['./charts-age-pie.component.scss']
})
export class ChartsAgePieComponent implements OnInit {
  single: any[] = [
    {
      "name": "Germany",
      "value": 8940000
    },
    {
      "name": "USA",
      "value": 5000000
    },
    {
      "name": "France",
      "value": 7200000
    }
  ];;
  multi: any[];
  
  // view: any[] = [700, 400];

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };


  constructor() { }

  ngOnInit() {
  }

  onSelect(event) {
    console.log(event);
  }
}
