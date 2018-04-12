import { Component, Input, OnChanges, OnInit, ElementRef, ViewChild, SimpleChanges } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Http, Headers, RequestOptions } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { mediaDetail } from '../model/feedback.model';
import { AlertModule, AlertService } from 'ngx-alerts';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { FileUploadModule } from 'ng2-file-upload';
import { MatButtonModule } from '@angular/material';
import { HttpService } from '../service/httpClient.service';

import { ValidationService } from '../service/validation.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AppConstants } from '../app.constants';
import { AdminComponent } from '../admin/admin.component';
import { Router } from '@angular/router';
import * as _ from 'underscore';
import { AccessDataModelComponent } from '../model/useraccess.data.model';
@Component({
  selector: 'app-smsui',
  templateUrl: './smsui.component.html',
  styleUrls: ['./smsui.component.scss']
})
export class SmsuiComponent implements OnInit {
  @Input() title: any;
  filteredUserAccessData: any;
  userAccessLevelObject: any;
  template = `<img src="../assets/icons/loader.gif" />`;
  smsContactForm: any;
  PHONE_REGEXP = /^([0]|\+91)?[789]\d{9}$/;
  submitted: boolean;
  cancelFileEdit: boolean;
  userAccessDataModel: AccessDataModelComponent;
  feature_id = 4;
  constructor(private spinnerService: Ng4LoadingSpinnerService, private httpClient: HttpClient,
     private formBuilder: FormBuilder, private alertService: AlertService,
     public adminComponent: AdminComponent, private router: Router) {
    this.smsContactForm = this.formBuilder.group({
      'phone': ['', Validators.compose([Validators.required, Validators.pattern(this.PHONE_REGEXP)])],
      'message': ['', [Validators.required, Validators.minLength(10)]],
      'check': [''],
      'file': [''],
      'client_id': []
    });
    if (Number(localStorage.getItem('feature_id')) !== this.feature_id) {
      this.userAccessDataModel = new AccessDataModelComponent(httpClient, router);
      this.userAccessDataModel.setUserAccessLevels(null , this.feature_id, 'admin/sms');
    }
   }
  ngOnInit() {
    setTimeout(function() {
      this.spinnerService.hide();
    }.bind(this), 3000);
  }
  smsContactFormSubmit() {
    this.spinnerService.show();
    console.log(this.smsContactForm.value);
    this.smsContactForm.controls['client_id'].setValue(AppConstants.CLIENT_ID);
    this.httpClient.post(AppConstants.API_URL + 'flujo_client_sendsms', this.smsContactForm.value)
      .subscribe(
      data => {
          this.spinnerService.hide();
        if (data) {
          this.alertService.success('Message has been sent successfully');
          this.smsContactForm.reset();
        }else {
        this.alertService.danger('Message not sent');
        this.smsContactForm.reset();
        }
      },
      error => {
        this.spinnerService.hide();
        console.log(error);
      });
  }
}
