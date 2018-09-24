import {Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ValidationService } from '../service/validation.service';
import { AlertModule, AlertService } from 'ngx-alerts';
import { AppConstants } from '../app.constants';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Router } from '@angular/router';
import * as _ from 'underscore';
import { ICommonInterface } from '../model/commonInterface.model';
@Component({
  templateUrl: './smtpconfiguration.component.html',
  styleUrls: ['./smtpconfiguration.component.scss']
})
export class SMTPConfigurationComponent implements OnInit {
  filteredUserAccessData: any;
  userAccessLevelObject: any;
  smtpUpdationForm: FormGroup;
  btn_text = 'save';
  successMessage: string;
  smtpItems: any;
  public isEdit = false;
  constructor(private spinnerService: Ng4LoadingSpinnerService  , private formBuilder: FormBuilder,
     private httpClient: HttpClient, private alertService: AlertService,
     private router: Router) {
    this.smtpUpdationForm = this.formBuilder.group({
      'host_name': ['', Validators.required],
      'from_name': ['', Validators.required],
      'from_email': ['', Validators.required, ],
      'user_name': ['', Validators.required],
      'password': ['', Validators.required],
      'client_id': null
    });
    this.getuserSMTPConfigData();
   }
   ngOnInit() {
    setTimeout(function() {
      this.spinnerService.hide();
    }.bind(this), 3000);
  }
// smtp post data to server
  SmtpPost(body: any ) {
    this.spinnerService.show();
    this.smtpUpdationForm.controls['client_id'].setValue(AppConstants.CLIENT_ID);
    this.httpClient.post<ICommonInterface>(AppConstants.API_URL + '/flujo_client_postsmtpconfiguration', this.smtpUpdationForm.value)
    .subscribe(
      res => {
        if ((!res.error) && (res.custom_status_code === 100)) {
          this.spinnerService.hide();
          this.getuserSMTPConfigData();
          this.alertService.success('SMTP Config Successfully');
        } else if ((res.error === true) && (res.custom_status_code = 102)) {
          this.spinnerService.hide();
          this.alertService.danger('Everything is upto date');
        }
      },
      err => {
        this.spinnerService.hide();
        this.alertService.danger('Something went wrong.');
      }
    );
  }

  getuserSMTPConfigData() {
    this.spinnerService.show();
    this.httpClient.get<ICommonInterface>(AppConstants.API_URL + 'flujo_client_getsmtpconfiguration/' + AppConstants.CLIENT_ID)
    .subscribe(
      data => {
        data.result ? this.isEdit = false : this.isEdit = true;

        if ((!data.error) && (data.custom_status_code === 100)) {
          this.spinnerService.hide();
         this.smtpItems = data.result;
        } else {
          this.spinnerService.hide();
          this.alertService.danger('No data found with this client.');
        }
      },
      error => {
        this.spinnerService.hide();
        this.alertService.danger('Something went wrong. please try again.');
          console.log(error);
      });
  }
  deleteSMTP() {
    this.spinnerService.show();
    this.httpClient.delete<ICommonInterface>(AppConstants.API_URL + 'flujo_client_deletesmtpconfiguration/' + AppConstants.CLIENT_ID)
    .subscribe(
      data => {
        this.btn_text = 'save';
        if ((!data.error) && (data.custom_status_code === 100)) {
          this.spinnerService.hide();
         this.smtpUpdationForm.reset();
         this.alertService.success('Social Links  deleted Successfully');
        }
        console.log(data);
      },
      error => {
        this.spinnerService.hide();
        this.alertService.danger('Something went wrong. please try again.');
          console.log(error);
      });
  }
  setSMTPDataFormDefault(smtpData) {
    this.smtpUpdationForm.controls['host_name'].setValue(smtpData[0].host_name);
    this.smtpUpdationForm.controls['from_name'].setValue(smtpData[0].from_name);
    this.smtpUpdationForm.controls['from_email'].setValue(smtpData[0].from_email);
    this.smtpUpdationForm.controls['user_name'].setValue(smtpData[0].user_name);
    this.smtpUpdationForm.controls['password'].setValue(smtpData[0].password);
    this.smtpUpdationForm.controls['client_id'].setValue(smtpData[0].client_id);
  }
  EditSMTPLinks(socialData) {
    this.isEdit = true;
    this.btn_text = 'update';
    this.setSMTPDataFormDefault(socialData);
  }
  cancelFileEdit() {
    this.isEdit = false;
    }
}
