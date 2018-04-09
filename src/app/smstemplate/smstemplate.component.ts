import { Component, OnInit } from '@angular/core';
export class TemplateData {
  id: number;
  header: string;
  message: string;
  footer: string;
}
@Component({
  selector: 'app-smstemplate',
  templateUrl: './smstemplate.component.html',
  styleUrls: ['./smstemplate.component.scss']
})
export class SmstemplateComponent implements OnInit {


  heroine: TemplateData = {
    id: 1,
    header: 'Tom',
    message: 'On behalf of Up coming Good Friday, We truly wishes a Happy n Joyful day',
    footer: '***From Flujo***'
  };

  templatestring: string;
  public templateText: string;
  header: string;
  message: string;
  footer: string;

  constructor() {
    this.header = 'Good Friday';
    this.message = 'On behalf of Up coming Good Friday, We truly wishes a Happy n Joyful day';
    this.footer = '***From Flujo***';
    this.templateText = '';
    this.templatestring = this.header + this.message + this.footer;
  }

  editTemplate( text ) {
    console.log((this.templatestring));
    this.templateText = text;
  }

  ngOnInit() {
  }

}
