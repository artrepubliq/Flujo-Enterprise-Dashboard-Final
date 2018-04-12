import { Component, OnChanges, OnInit, ElementRef, ViewChild, SimpleChanges } from '@angular/core';
import { CKEditorModule } from 'ngx-ckeditor';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../service/httpClient.service';
import { ValidationService } from '../service/validation.service';
import { AlertModule, AlertService } from 'ngx-alerts';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { NgxSmartLoaderService } from 'ngx-smart-loader';
import { AdminComponent } from '../admin/admin.component';
import { Router } from '@angular/router';
import * as _ from 'underscore';
import { AccessDataModelComponent } from '../model/useraccess.data.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-emailservice',
  templateUrl: './emailservice.component.html',
  styleUrls: ['./emailservice.component.scss']
})
export class EmailserviceComponent implements OnInit, OnChanges {
  filteredUserAccessData: any;
  userAccessLevelObject: any;
  mailSendingForm: FormGroup;
  socialLinksForm: FormGroup;
  successMessagebool: boolean;
  public loading: false;
  successMessage: string;
  deleteMessage: string;
  submitted: boolean;
  editorValue: string;
  Ishide3: boolean;
  feature_id: number;
  userAccessDataModel: AccessDataModelComponent;
  EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
  constructor(public loader: NgxSmartLoaderService, private httpClient: HttpClient,
    private spinnerService: Ng4LoadingSpinnerService, private formBuilder: FormBuilder,
    private httpService: HttpService, private alertService: AlertService, public adminComponent: AdminComponent,
    private router: Router) {
    this.feature_id = 3;
    this.mailSendingForm = this.formBuilder.group({
      'email': ['', Validators.compose([Validators.required, Validators.pattern(this.EMAIL_REGEXP)])],
      'subject': ['', Validators.required],
      'message': ['', Validators.required],
      'file': [null],
      'check': [''],
      'client_id': null
    });
    if (Number(localStorage.getItem('feature_id')) !== 3) {
      this.userAccessDataModel = new AccessDataModelComponent(httpClient, router);
      this.userAccessDataModel.setUserAccessLevels(null, this.feature_id, 'admin/email');
    }
  }

  ngOnInit() {
    setTimeout(function () {
      this.spinnerService.hide();
    }.bind(this), 3000);
  }
  ngOnChanges(title: SimpleChanges) {
  }
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
