import { Component, OnInit, ElementRef, ViewChild, SimpleChanges } from '@angular/core';
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
@Component({
  selector: 'app-smsui',
  templateUrl: './smsui.component.html',
  styleUrls: ['./smsui.component.scss']
})
export class SmsuiComponent implements OnInit {
  filteredUserAccessData: any;
  userAccessLevelObject: any;
  template = `<img src="../assets/icons/loader.gif" />`;
  smsContactForm: any;
  PHONE_REGEXP = /^([0]|\+91)?[789]\d{9}$/;
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
    if (this.adminComponent.userAccessLevelData) {
      console.log(this.adminComponent.userAccessLevelData[0].name);
      this.userRestrict();
    } else {
      this.adminComponent.getUserAccessLevelsHttpClient()
        .subscribe(
          resp => {
            console.log(resp);
            this.spinnerService.hide();
            _.each(resp, item => {
              if (item.user_id === localStorage.getItem('user_id')) {
                  this.userAccessLevelObject = item.access_levels;
              }else {
                // this.userAccessLevelObject = null;
              }
            });
            this.adminComponent.userAccessLevelData = JSON.parse(this.userAccessLevelObject);
            this.userRestrict();
          },
          error => {
            console.log(error);
            this.spinnerService.hide();
          }
        );
    }
   }
  ngOnInit() {
    setTimeout(function() {
      this.spinnerService.hide();
    }.bind(this), 3000);
  }
// this for restrict user on root access level
userRestrict() {
  _.each(this.adminComponent.userAccessLevelData, (item, iterate) => {
    // tslint:disable-next-line:max-line-length
    if (this.adminComponent.userAccessLevelData[iterate].name === 'SMS' && this.adminComponent.userAccessLevelData[iterate].enable) {
      this.filteredUserAccessData = item;
      } else {
        // this.router.navigate(['/accessdenied']);
        // console.log('else');
      }
    });
    if (this.filteredUserAccessData) {
      this.router.navigate(['/sms']);
    }else {
      this.router.navigate(['/accessdenied']);
      console.log('else');
    }
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
