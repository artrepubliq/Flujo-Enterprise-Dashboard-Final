import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-facebook',
  templateUrl: './facebook.component.html',
  styleUrls: ['./facebook.component.scss', '../social-management/social-management.component.scss']
})
export class FacebookComponent implements OnInit {
  public config: any;
  public doComment: boolean;
  constructor() { }

  ngOnInit() {
  }

}
