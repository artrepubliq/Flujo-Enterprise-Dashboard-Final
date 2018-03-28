import { Component, OnInit, Input } from '@angular/core';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import { AgeDetails } from '../model/analytics.model';

@Component({
  selector: 'app-charts-age-pie',
  templateUrl: './charts-age-pie.component.html',
  styleUrls: ['./charts-age-pie.component.scss']
})
export class ChartsAgePieComponent implements OnInit {
 @Input() ageData: AgeDetails;
  multi: any[];
  
  // view: any[] = [700, 400];

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };


  constructor() { }

  ngOnInit() {
    console.log(this.ageData);
  }

  onSelect(event) {
    console.log(event);
  }
}
