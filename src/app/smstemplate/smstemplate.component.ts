import { Component, OnInit } from '@angular/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs/operators/map';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../app.constants';
import { IHttpResponse } from '../model/httpresponse.model';
import { AlertService } from 'ngx-alerts';
import { ISmsTemplateData } from '../model/smsTemplateData';
import * as _ from 'underscore';
import { ICommonInterface } from '../model/commonInterface.model';
import { AccessDataModelComponent } from '../model/useraccess.data.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-smstemplate',
  templateUrl: './smstemplate.component.html',
  styleUrls: ['./smstemplate.component.scss']
})
export class SmstemplateComponent implements OnInit {
  templateText1: any;
  isMain = true;
  feature_id = 27;
  smsTemplateData2: any;
  // templateCategory: any;
  ttt: any;
  isHide = false;
  smsTemplateData1: ISmsTemplateData[];
  smsTemplateData: ISmsTemplateData[];
  isView: boolean;
  isEdit: boolean;
  smsTemplateConfigurationForm: FormGroup;
  // templateCategory: FormControl = new FormControl();
  templateCategory: FormControl;
  templatestring: string;
  public templateText: string;
  header: string;
  public button_text: string;
  message: string;
  footer: string;
  options = [];
  smsfilteredData: any;
  filteredOptions: Observable<string[]>;
  userAccessDataModel: AccessDataModelComponent;
  constructor(private spinnerService: Ng4LoadingSpinnerService,
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private alertService: AlertService,
    private router: Router) {
    this.templateText = '';
    this.templatestring = this.header + this.message + this.footer;
    this.smsTemplateConfigurationForm = this.formBuilder.group({
      'template_text': ['', Validators.required],
      'template_category': [''],
      'template_name': ['', Validators.required],
      'client_id': [null],
      'smstemplateconfig_id': [null]
    });
    this.templateCategory = new FormControl('', Validators.required);
    if (Number(localStorage.getItem('feature_id')) !== this.feature_id) {
      this.userAccessDataModel = new AccessDataModelComponent(httpClient, router);
      this.userAccessDataModel.setUserAccessLevels(null, this.feature_id, 'admin/smsconfiguration');
      // this.filteredOptions = [];
    }
  }
  editTemplate(text) {
    this.templateText = text;
  }
  ngOnInit() {
    this.getSMSTemplateConfigurationData();
    setTimeout(function () {
      this.spinnerService.hide();
    }.bind(this), 1000);
  }

  onSubmit = (body) => {
    this.spinnerService.hide();
    if (this.templateCategory.value === null) {
      this.smsTemplateConfigurationForm.controls['template_category'].setValue(body.template_category);
    } else {
      this.smsTemplateConfigurationForm.controls['template_category'].setValue(this.templateCategory.value);
    }
    this.smsTemplateConfigurationForm.controls['client_id'].setValue(AppConstants.CLIENT_ID);
    if (this.smsTemplateData) {
      this.smsTemplateConfigurationForm.controls['smstemplateconfig_id'].setValue(body.smstemplateconfig_id);
    }
    const formModel = this.smsTemplateConfigurationForm.value;
    this.httpClient.post<ICommonInterface>(AppConstants.API_URL + 'flujo_client_postsmstemplateconfig', formModel)
      .subscribe(
        data => {
            if (!data.error && data.custom_status_code === 100) {
              this.alertService.success('Template data submitted successfully');
              this.spinnerService.hide();
              this.smsTemplateConfigurationForm.reset();
              this.templateCategory.setValue('');
              this.isEdit = false;
              this.isView = true;
              this.getSMSTemplateConfigurationData();
              // this.getSMSTemplateDetails(this.smsTemplateData1);
            } else if (data.error && data.custom_status_code === 101) {
              this.alertService.warning('Required parameters are missing');
              this.spinnerService.hide();
            } else if (data.error && data.custom_status_code === 102) {
              this.alertService.warning('Everything is upto date');
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
  getSMSTemplateConfigurationData = () => {
    this.spinnerService.show();
    this.options = [];
    this.httpClient.get<ICommonInterface>(AppConstants.API_URL + '/flujo_client_getsmstemplateconfig/' + AppConstants.CLIENT_ID)
      .subscribe(
        data => {
            if (data.custom_status_code === 100 && !data.error) {
              this.smsTemplateData2 = _.unique(data.result, (item) => {
                return item.template_category;
              });

              this.smsTemplateData = data.result;
              this.smsTemplateData1 = data.result;
              this.smsTemplateData2.map((smsData) => {
                // console.log(smsData);
                smsData.isActive = false;
                this.options.push(smsData.template_category);
                this.getFilteredSmsData();
              });
              this.spinnerService.hide();
            } else if (data.error && data.custom_status_code === 101) {
              this.alertService.warning('Required parameters are missing');
          }
        }, error => {
          console.log(error);
        }
      );
  }
  deleteSmsTemplate = (item) => {
    this.spinnerService.show();
    this.httpClient.delete<ICommonInterface>(AppConstants.API_URL + '/flujo_client_deletesmstemplateconfig/' + item)
      .subscribe(
        data => {
            if (!data.error && data.custom_status_code === 100) {
              this.alertService.warning('Deleted successfully');
              this.spinnerService.hide();
              this.getSMSTemplateConfigurationData();
              // this.getSMSTemplateDetails(this.smsTemplateData1);
              // this.getFilteredSmsData();
              this.spinnerService.hide();
            } else if (data.error && data.custom_status_code === 101) {
              this.alertService.warning('Required parameters are missing');
              this.spinnerService.hide();
            }
          this.spinnerService.hide();
          // this.getFilteredSmsData();
        },
        error => {
          console.log(error);
          this.spinnerService.hide();
          this.alertService.danger('Something went wrong');
        }
      );
  }
  getFilteredSmsData() {
    this.filteredOptions = this.templateCategory.valueChanges.pipe(
      startWith(''),
      map(val => this.filter(val))
    );
  }

  filter(val: string): string[] {
    return this.options.filter(option => option.toLowerCase().indexOf(val.toLowerCase()) === 0);
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
      this.templateCategory.setValue(SmstemplateUpdateData.template_category);
    }
  }
  addTemplate() {
    this.smsTemplateConfigurationForm.reset();
    this.templateCategory.setValue('');
    this.isEdit = true;
    this.isView = false;
    this.button_text = 'Submit';
  }
  cancelEdit() {
    this.isEdit = false;
    this.isView = true;
    this.smsTemplateConfigurationForm.reset();
  }
  editSmsTemplate(SmstemplateUpdate) {
    this.templateText1 = SmstemplateUpdate.template_text;
    this.isEdit = true;
    this.isView = false;
    this.button_text = 'Update';
    this.setDefaultSmsTemplateDetails(SmstemplateUpdate);
    this.getFilteredSmsData();
  }
}
