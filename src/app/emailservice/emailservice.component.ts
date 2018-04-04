import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CKEditorModule } from 'ngx-ckeditor';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { HttpService } from '../service/httpClient.service';
import { ValidationService } from '../service/validation.service';
import { AlertModule, AlertService } from 'ngx-alerts';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { NgxSmartLoaderService } from 'ngx-smart-loader';
import { AdminComponent } from '../admin/admin.component';
import { Router } from '@angular/router';
import * as _ from 'underscore';
@Component({
  selector: 'app-emailservice',
  templateUrl: './emailservice.component.html',
  styleUrls: ['./emailservice.component.scss']
})
export class EmailserviceComponent implements OnInit {
  filteredUserAccessData: any;
  userAccessLevelObject: any;
  mailSendingForm: FormGroup;
  socialLinksForm: FormGroup;
  successMessagebool: boolean;
  public loading: false;
  successMessage: string;
  deleteMessage: string;
  submitted:boolean;
  editorValue: string;
  Ishide3: boolean;
  EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
  constructor(public loader: NgxSmartLoaderService, private spinnerService: Ng4LoadingSpinnerService, private formBuilder: FormBuilder,
     private httpService: HttpService, private alertService: AlertService, public adminComponent: AdminComponent,
    private router: Router) {
    this.mailSendingForm = this.formBuilder.group({
      'email': ['', Validators.compose([Validators.required, Validators.pattern(this.EMAIL_REGEXP)])],
      'subject': ['', Validators.required],
      'message': ['', Validators.required],
      'file': [null],
      'check': [''],
      'client_id': null
    });
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
  userRestrict() {
    _.each(this.adminComponent.userAccessLevelData, (item, iterate) => {
      // tslint:disable-next-line:max-line-length
      if (this.adminComponent.userAccessLevelData[iterate].name === 'Mail' && this.adminComponent.userAccessLevelData[iterate].enable) {
        this.filteredUserAccessData = item;
      } else {
      }
    });
    if (this.filteredUserAccessData) {
      this.router.navigate(['admin/email']);
    }else {
      this.router.navigate(['/accessdenied']);
    }
  }
  // socialLinksFormSubmit(body: any) {
  //   console.log(this.socialLinksForm.value);
  // }
  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.mailSendingForm.get('file').setValue(file);
    }
  }
  mailSendingFormSubmit(body: any) {
    this.spinnerService.show();
    console.log(this.mailSendingForm.value);
    this.httpService.create(this.mailSendingForm.value, '/flujo_client_emailcsvdb')
      .subscribe(
      data => {
        if (data) {
          this.alertService.success('Email has been sent ');
          this.mailSendingForm.reset();
          this.spinnerService.hide();
        }
      },
      error => {
        console.log(error);
        this.alertService.danger('Email could not be sent ');
        this.mailSendingForm.reset();
        this.spinnerService.hide();
      });
  }
}
