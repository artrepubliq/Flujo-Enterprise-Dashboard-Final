import { Component, OnChanges, OnInit, ElementRef, ViewChild, SimpleChanges, Inject } from '@angular/core';
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
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EmailTemplateService } from '../email-template/email-template-service';
import { AppConstants } from '../app.constants';
import { IPostEmailTemplate } from '../model/emailThemeConfig.model';
@Component({
  selector: 'app-emailservice',
  templateUrl: './emailservice.component.html',
  styleUrls: ['./emailservice.component.scss']
})
export class EmailserviceComponent implements OnInit {
  test: IPostEmailTemplate[];
  selectedEmailTemplateData: any;
  emailTemplateHtml: any;
  allEmailTemplateData: IPostEmailTemplate[];
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

  constructor(public loader: NgxSmartLoaderService, private spinnerService: Ng4LoadingSpinnerService, private formBuilder: FormBuilder,
    private httpService: HttpService, private alertService: AlertService, public adminComponent: AdminComponent,
    private router: Router,
    public dialog: MatDialog, private httpClient: HttpClient,
    private emailTemplateService: EmailTemplateService) {
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
    this.getEmailTemplateData();
  }

  ngOnInit() {
    setTimeout(function () {
      this.spinnerService.hide();
    }.bind(this), 3000);
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
  /*Getting of email template data from api using emailTemplateService*/
  getEmailTemplateData = (): void => {
    this.emailTemplateService.getTemplateConfigData('/flujo_client_getemailtemplateconfig/', AppConstants.CLIENT_ID)
      .subscribe(
        data => {
          console.log(data);
          this.allEmailTemplateData = data.result;
          this.allEmailTemplateData.map((templateData) => {
            templateData.isActive = false;
          });
        }
      );
  }
  /* Popup of choose template */
  templateSelectPopup(): void {
    const dialogRef = this.dialog.open(EmailTemplateSelectionPopup, {
      width: '80vw',
      height: '60vh',
      data: this.allEmailTemplateData,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedEmailTemplateData = result;
      } else {
        console.log('no template was selected');
      }
    });
  }
}
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'email-select-popup.html',
  styleUrls: ['./emailservice.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class EmailTemplateSelectionPopup {
  selectedEmailTemplateData: IPostEmailTemplate[];
  constructor(
    public dialogRef: MatDialogRef<EmailTemplateSelectionPopup>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  selectedEmailData(emailTemplateHtmlData) {
    this.data.map((emailData) => {
      emailData.isActive = false;
    });
    emailTemplateHtmlData.isActive = true;
    this.selectedEmailTemplateData = emailTemplateHtmlData.template_html;
  }
  /*Sending the selected data to assign in form of email submission*/
  closeDialog = () => {
    this.dialogRef.close(this.selectedEmailTemplateData);
  }
  cancelDialog = () => {
    this.dialogRef.close();
  }
}
