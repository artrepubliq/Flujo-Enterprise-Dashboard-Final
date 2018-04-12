import { Component, OnInit } from '@angular/core';
import { AccessDataModelComponent } from '../model/useraccess.data.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
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
  feature_id = 27;
  userAccessDataModel: AccessDataModelComponent;
  constructor(private httpClient: HttpClient, private router: Router) {
    this.header = 'Good Friday';
    this.message = 'On behalf of Up coming Good Friday, We truly wishes a Happy n Joyful day';
    this.footer = '***From Flujo***';
    this.templateText = '';
    this.templatestring = this.header + this.message + this.footer;
    if (Number(localStorage.getItem('feature_id')) !== this.feature_id) {
      this.userAccessDataModel = new AccessDataModelComponent(httpClient, router);
      this.userAccessDataModel.setUserAccessLevels(null, this.feature_id, 'admin/smsconfiguration');
    }
  }
  editTemplate( text ) {
    console.log((this.templatestring));
    this.templateText = text;
  }

  ngOnInit() {
  }

}
