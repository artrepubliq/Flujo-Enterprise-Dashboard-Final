import { Component, OnInit, ElementRef, ViewChild, SimpleChanges, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Http, Headers, RequestOptions } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { mediaDetail } from '../model/feedback.model';
import { AlertModule, AlertService } from 'ngx-alerts';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { FileUploadModule } from 'ng2-file-upload';
import { MatButtonModule, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { HttpService } from '../service/httpClient.service';
import { ValidationService } from '../service/validation.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AppConstants } from '../app.constants';
import { AdminComponent } from '../admin/admin.component';
import { Router } from '@angular/router';
import * as _ from 'underscore';
import { SmsTemplateSelectService } from './sms-template-select-service';
import { ISmsTemplateData } from '../model/smsTemplateData';
@Component({
  selector: 'app-smsui',
  templateUrl: './smsui.component.html',
  styleUrls: ['./smsui.component.scss']
})
export class SmsuiComponent implements OnInit {
  selectedSmsTemplateData: any;
  smsTemplateSelectionData: ISmsTemplateData[];
  template = `<img src="../assets/icons/loader.gif" />`;
  smsContactForm: any;
  PHONE_REGEXP = /^([0]|\+91)?[789]\d{9}$/;
  constructor(private spinnerService: Ng4LoadingSpinnerService, private httpClient: HttpClient,
     private formBuilder: FormBuilder, private alertService: AlertService,
     public adminComponent: AdminComponent, private router: Router,
     public dialog: MatDialog, private smsSelectionService: SmsTemplateSelectService) {
    this.smsContactForm = this.formBuilder.group({
      'phone': ['', Validators.compose([Validators.required, Validators.pattern(this.PHONE_REGEXP)])],
      'message': ['', [Validators.required, Validators.minLength(10)]],
      'check': [''],
      'file': [''],
      'client_id': []
    });
   }
  ngOnInit() {
    this.getSlectedTemplateData();
    setTimeout(function() {
      this.spinnerService.hide();
    }.bind(this), 3000);
  }
  /* Sending the sms data to api */
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
        } else {
        this.alertService.danger('Message not sent');
        this.smsContactForm.reset();
        }
      },
      error => {
        this.spinnerService.hide();
        console.log(error);
      });
  }
  cancelSmsEdit = () => {
    this.smsContactForm.reset();
  }
  /* Geting the data from api using sms template selection service */
  getSlectedTemplateData = () => {
    this.smsSelectionService.getSmsSelectData('/flujo_client_getsmstemplateconfig/', AppConstants.CLIENT_ID)
    .subscribe(
      data => {
        this.smsTemplateSelectionData = data;
        this.smsTemplateSelectionData.map((smsData) => {
          smsData.isActive = false;
        });
      }, err => {
        console.log(err);
      }
    );
  }
  /* Pop up for template selection */
  openDialog(): void {
    const dialogRef = this.dialog.open(SmsTemplateSelectionDialog, {
      width: '45vw',
      height: '60vh',
      data: this.smsTemplateSelectionData,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        this.selectedSmsTemplateData = result;
        console.log(this.selectedSmsTemplateData);
      } else {
        console.log('no template was selected');
      }
    });
  }
}

/* Popup for selection of templates*/
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'smstemplate-dialog',
  templateUrl: 'smstemplate-dialog.html',
  styleUrls: ['./smsui.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class SmsTemplateSelectionDialog {
  isActive: boolean;
totalSmsTemplateData: ISmsTemplateData[];
  constructor(
    public dialogRef: MatDialogRef<SmsTemplateSelectionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  selectedSmsText = (selectedSmsData, i) => {
    this.data.map((smsData) => {
      smsData.isActive = false;
    });
    selectedSmsData.isActive = true;
    this.totalSmsTemplateData = selectedSmsData.template_text;
    console.log(this.totalSmsTemplateData);
  }
  /*Sending the selected data to assign in form of sms submission*/
  closeDialog = () => {
this.dialogRef.close(this.totalSmsTemplateData);
  }
  cancelDialog = () => {
    this.dialogRef.close();
  }
}
