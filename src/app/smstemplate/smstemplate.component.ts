import { Component, OnInit } from '@angular/core';

import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs/operators/map';
import { ITemplateData } from '../model/TemplateData';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../app.constants';
import { IHttpResponse } from '../model/httpresponse.model';
import { AlertService } from 'ngx-alerts';
import { ISmsTemplateData } from '../model/smsTemplateData';
import * as _ from 'underscore';

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



  editTemplate( text ) {

  templateText1: any;
  isMain = true;
  smsTemplateData2: any;
  templateCategory: any;
  ttt: any;
  isHide = false;
  smsTemplateData1: ISmsTemplateData[];
  smsTemplateData: ISmsTemplateData[];
  isView: boolean;
  isEdit: boolean;
  smsTemplateConfigurationForm: FormGroup;
  templateData: ITemplateData = {
    id: 1,
    header: '',
    message: '',
    footer: ''
  };
  myControl: FormControl = new FormControl();
  templatestring: string;
  public templateText: string;
  header: string;
  public button_text: string;
  message: string;
  footer: string;
  options = [];
  smsfilteredData: any;
  filteredOptions: Observable<string[]>;
  constructor(private spinnerService: Ng4LoadingSpinnerService,
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private alertService: AlertService) {
    this.header = this.templateData.header;
    this.message = this.templateData.message;
    this.footer = this.templateData.footer;
    this.templateText = '';
    this.templatestring = this.header + this.message + this.footer;
    this.smsTemplateConfigurationForm = this.formBuilder.group({
      'template_text': ['', Validators.required],
      'template_category': [''],
      'template_name': ['', Validators.required],
      'client_id': [null],
      'smstemplateconfig_id': [null]
    });
  }



  editTemplate( text ) {
    console.log((this.templatestring));

    this.templateText = text;
  }

  ngOnInit() {
    this.getSMSTemplateConfigurationData();
    setTimeout(function () {
      this.spinnerService.hide();
    }.bind(this), 1000);
  }

  filter(val: string): string[] {
    return this.options.filter(option => option.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }
  onSubmit = (body) => {
    this.spinnerService.hide();
    this.smsTemplateConfigurationForm.controls['template_category'].setValue(this.myControl.value);
    this.smsTemplateConfigurationForm.controls['client_id'].setValue(AppConstants.CLIENT_ID);
    if (this.smsTemplateData) {
      this.smsTemplateConfigurationForm.controls['smstemplateconfig_id'].setValue(body.smstemplateconfig_id);
    }
    const formModel = this.smsTemplateConfigurationForm.value;
    this.httpClient.post<IHttpResponse>(AppConstants.API_URL + 'flujo_client_postsmstemplateconfig', formModel)
      .subscribe(
        data => {
          if (!data.error) {
            this.alertService.success('template data submitted successfully');
            this.spinnerService.hide();
            this.smsTemplateConfigurationForm.reset();
            this.getSMSTemplateConfigurationData();
          } else {
            this.alertService.warning(data.result);
            this.spinnerService.hide();
          }
          this.spinnerService.hide();
        },
        error => {
          console.log(error);
          this.spinnerService.hide();
        }
      );
  }
  getSMSTemplateConfigurationData = (): void => {
    this.spinnerService.show();
    this.httpClient.get<ISmsTemplateData[]>(AppConstants.API_URL + '/flujo_client_getsmstemplateconfig/' + AppConstants.CLIENT_ID)
      .subscribe(
        data => {
          this.smsTemplateData2 = _.unique(data, (item) => {
            return item.template_category;
          });
          this.smsTemplateData = data;
          this.smsTemplateData1 = data;
          this.smsTemplateData2.map((smsData) => {
            // console.log(smsData);
            smsData.isActive = false;
            this.options.push(smsData.template_category);
            this.getFilteredSmsData();
          });
        }, error => {
          console.log(error);
        }
      );
  }
  deleteSmsTemplate = (item) => {
    this.spinnerService.show();
    this.httpClient.delete<IHttpResponse>(AppConstants.API_URL + '/flujo_client_deletesmstemplateconfig/' + item)
      .subscribe(
        data => {
          if (!data.error) {
            this.alertService.warning('Deleted successfully');
            this.spinnerService.hide();
            this.getSMSTemplateDetails(this.smsTemplateData1);
            this.getSMSTemplateConfigurationData();
          }
          this.spinnerService.hide();
        },
        error => {
          console.log(error);
          this.spinnerService.hide();
          this.alertService.danger('Something went wrong');
        }
      );
  }
  getFilteredSmsData() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(val => this.filter(val))
    );
  }
  getSMSTemplateDetails = (template_item): void => {
    this.smsTemplateData.map((smsData) => {
      smsData.isActive = false;
    });
    this.smsTemplateData1 = _.filter(this.smsTemplateData, (filteredSmsTemplates) => {
      return filteredSmsTemplates.template_category === template_item.template_category;
    });
    template_item.isActive = true;
    this.isHide = true;
    this.isMain = false;
  }
  setDefaultSmsTemplateDetails(SmstemplateUpdateData) {
    if (SmstemplateUpdateData) {
      this.smsTemplateConfigurationForm.controls['template_category'].setValue(SmstemplateUpdateData.template_category);
      this.smsTemplateConfigurationForm.controls['template_name'].setValue(SmstemplateUpdateData.template_name);
      this.smsTemplateConfigurationForm.controls['template_text'].setValue(this.templateText1);
      this.smsTemplateConfigurationForm.controls['smstemplateconfig_id'].setValue(SmstemplateUpdateData.id);
    }
  }
  addTemplate() {
    this.smsTemplateConfigurationForm.reset();
    this.isEdit = true;
    this.isView = false;
    this.button_text = 'Submit';
  }
  cancelEdit() {
    this.isEdit = false;
    this.isView = true;
  }
  editSmsTemplate(SmstemplateUpdate) {
    this.templateText1 = SmstemplateUpdate.template_text;
    this.isEdit = true;
    this.isView = false;
    this.button_text = 'Update';
    this.setDefaultSmsTemplateDetails(SmstemplateUpdate);
  }
}
