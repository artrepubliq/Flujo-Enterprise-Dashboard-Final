import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-socialconfiguration',
  templateUrl: './socialconfiguration.component.html',
  styleUrls: ['./socialconfiguration.component.scss']
})
export class SocialconfigurationComponent implements OnInit {
  btn_text = 'save';
  smtpItems: any;
  public isEdit = false;
  constructor() { }

  ngOnInit() {
  }

  EditConfigItems() {
    this.isEdit = true;
    this.btn_text = 'update';
  }
  cancelFileEdit() {
    this.isEdit = false;
    }
}
