import {Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ValidationService } from '../service/validation.service';
import { AlertModule, AlertService } from 'ngx-alerts';
import { AppConstants } from '../app.constants';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Router } from '@angular/router';
import { AdminComponent } from '../admin/admin.component';
import * as _ from 'underscore';
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
     private router: Router, public adminComponent: AdminComponent) {
    this.smtpUpdationForm = this.formBuilder.group({
      'host_name': ['', Validators.required],
      'from_name': ['', Validators.required],
      'from_email': ['', Validators.required, ],
      'user_name': ['', Validators.required],
      'password': ['', Validators.required],
      'client_id': null
    });
    this.getuserSMTPConfigData();
    if (this.adminComponent.userAccessLevelData) {
      this.userRestrict();
    } else {
      this.adminComponent.getUserAccessLevelsHttpClient()
        .subscribe(
          resp => {
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
      if (this.adminComponent.userAccessLevelData[iterate].name === 'SMTP' && this.adminComponent.userAccessLevelData[iterate].enable) {
        this.filteredUserAccessData = item;
      } else {
      }
    });
    if (this.filteredUserAccessData) {
      this.router.navigate(['admin/smtpconfiguration']);
    }else {
      this.router.navigate(['/accessdenied']);
    }
  }
// smtp post data to server
  SmtpPost(body: any ) {
    this.spinnerService.show();
    this.smtpUpdationForm.controls['client_id'].setValue(AppConstants.CLIENT_ID);
    this.httpClient.post(AppConstants.API_URL + '/flujo_client_postsmtpconfiguration', this.smtpUpdationForm.value)
    .subscribe(
      res => {
        if (res) {
          this.spinnerService.hide();
          this.getuserSMTPConfigData();
          this.alertService.success('SMTP Config Successfully');
        } else {
          this.spinnerService.hide();
          this.alertService.danger('No modifications found');
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
    this.httpClient.get(AppConstants.API_URL + 'flujo_client_getsmtpconfiguration/' + AppConstants.CLIENT_ID)
    .subscribe(
      data => {
        data ? this.isEdit = false : this.isEdit = true;

        if (data) {
          this.spinnerService.hide();
         this.smtpItems = data;
        }else {

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
    this.httpClient.delete(AppConstants.API_URL + 'flujo_client_deletesmtpconfiguration/' + AppConstants.CLIENT_ID)
    .subscribe(
      data => {
        this.btn_text = 'save';
        if (data) {
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
    this.smtpUpdationForm.controls['host_name'].setValue(smtpData.host_name);
    this.smtpUpdationForm.controls['from_name'].setValue(smtpData.from_name);
    this.smtpUpdationForm.controls['from_email'].setValue(smtpData.from_email);
    this.smtpUpdationForm.controls['user_name'].setValue(smtpData.user_name);
    this.smtpUpdationForm.controls['password'].setValue(smtpData.password);
    this.smtpUpdationForm.controls['client_id'].setValue(smtpData.client_id);
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
