import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-charts-gender',
  templateUrl: './charts-gender.component.html',
  styleUrls: ['./charts-gender.component.scss']
})
export class ChartsGenderComponent implements OnInit {
  @Input() gender: any;
  constructor() { }

  ngOnInit() {
    console.log(JSON.stringify(this.gender));
  }

}
