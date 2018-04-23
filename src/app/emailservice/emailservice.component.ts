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
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { EmailTemplateService } from '../email-template/email-template-service';
import { AppConstants } from '../app.constants';
import { IPostEmailTemplate, ICsvData } from '../model/emailThemeConfig.model';
import { PapaParseService } from 'ngx-papaparse';
import CSVExportService from 'json2csvexporter';
import { ICommonInterface } from '../model/commonInterface.model';
import { MessageArchivedComponent } from '../directives/snackbar-sms-email/snackbar-email-sms';
@Component({
  selector: 'app-emailservice',
  templateUrl: './emailservice.component.html',
  styleUrls: ['./emailservice.component.scss']
})
export class EmailserviceComponent implements OnInit {
  multipleEmails: boolean;
  errorInFormat: boolean;
  emailContactsArray: ICsvData[];
  filteredEmailContacts = [];
  errorEmailContacts = [];
  isOpen = false;
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
  @ViewChild('file') file: ElementRef;
  userAccessDataModel: AccessDataModelComponent;
  EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;

  constructor(public loader: NgxSmartLoaderService, private spinnerService: Ng4LoadingSpinnerService, private formBuilder: FormBuilder,
    private httpService: HttpService, private alertService: AlertService, public adminComponent: AdminComponent,
    private router: Router,
    public dialog: MatDialog, private httpClient: HttpClient,
    private emailTemplateService: EmailTemplateService,
    private papa: PapaParseService,
    public snackBar: MatSnackBar) {
    this.feature_id = 3;
    this.mailSendingForm = this.formBuilder.group({
      'email': ['', Validators.compose([Validators.required])],
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
    this.emailContactsArray = [];
    this.errorEmailContacts = [];
    this.multipleEmails = true;
  }

  ngOnInit() {
    setTimeout(function () {
      this.spinnerService.hide();
    }.bind(this), 3000);
  }

  public checkValidEmails(event) {
    if (event != null) {
      const emailsArray = event.split(',');
      const errorEmails = [];
      emailsArray.map(item => {
        if (item !== '' && item.match(this.EMAIL_REGEXP) == null) {
          // this.multipleEmails = false;
          errorEmails.push(item);
        }
      });
      if (errorEmails.length > 0) {
        this.multipleEmails = false;
        // return false;
      } else {
        this.multipleEmails = true;
      }
    }
  }
  mailSendingFormSubmit(body: any) {
    if (this.multipleEmails === false) {
      return false;
    }
    console.log(this.mailSendingForm.value);
    this.mailSendingForm.controls['client_id'].setValue(AppConstants.CLIENT_ID);
    this.spinnerService.show();
    this.httpClient.post<ICommonInterface>(AppConstants.API_URL + '/flujo_client_sendemaildbcsv', this.mailSendingForm.value)
      .subscribe(
        data => {
          if (AppConstants.ACCESS_TOKEN === data.access_token) {
            if (!data.error && (data.custom_status_code = 100)) {
              this.alertService.success('Email has been sent ');
              this.mailSendingForm.reset();
              this.spinnerService.hide();
              this.multipleEmails = true;
              this.file.nativeElement.value = null;
            }
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
    this.spinnerService.show();
    this.emailTemplateService.getTemplateConfigData('/flujo_client_getemailtemplateconfig/', AppConstants.CLIENT_ID)
      .subscribe(
        data => {
          this.spinnerService.hide();
          console.log(data);
          this.isOpen = true;
          this.allEmailTemplateData = data.result;
          this.allEmailTemplateData.map((templateData) => {
            templateData.isActive = false;
          });
        },
        error => {
          this.spinnerService.hide();
        }
      );
  }
  cancelMail = () => {
    this.mailSendingForm.reset();
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
  async getEmailCsvContacts(event) {
    this.emailContactsArray = [];
    this.filteredEmailContacts = [];
    this.errorEmailContacts = [];
    const fileReader = new FileReader;
    const file = event.target.files[0];
    const csvEmailData = file;
    this.emailContactsArray = await this.getCsvData(csvEmailData);
    console.log(this.emailContactsArray);
    console.log(this.emailContactsArray);
    if (this.emailContactsArray.length > 0) {
      this.emailContactsArray.map((item, index) => {
        if (item.Email) {
          if (item.Email !== '' && item.Email.match(this.EMAIL_REGEXP) != null) {
            this.filteredEmailContacts.push(item);
          } else {
            this.errorEmailContacts.push(index);
            this.errorInFormat = true;
          }
        } else {
          event.target.value = null;
          const snackBarRef = this.snackBar.open('The uploaded format not follwoing our standards', '', {
            duration: 3000,
            extraClasses: ['alert-snackbar']
          });
        }
      });
      console.log(this.errorEmailContacts);
      console.log(this.filteredEmailContacts);
    }
    this.mailSendingForm.get('file').setValue(this.filteredEmailContacts);
  }
  getCsvData(csvEmailData): Promise<any> {
    return new Promise((resolve, reject) => {
      this.papa.parse(csvEmailData, {
        header: true,
        complete: (results) => {
          // this.emailContactsArray = results.data;
          // console.log(results.data);
          resolve(results.data);
        }
      });
    });
    // return this.emailContactsArray;
  }
  continue() {
    this.errorInFormat = false;
  }
  rectify() {
    this.errorInFormat = false;
    // event.target.value = null;
    this.file.nativeElement.value = null;
  }
  downLoadCsvFormat = () => {
    const csvFormatData = [
      { Name: 'Test', Email: 'test@flujo.in' },
      { Name: 'Test', Email: 'test1@flujo.in' },
      { Name: 'Test', Email: 'test1@flujo.in' }
    ];
    const exporter = CSVExportService.create();
    exporter.downloadCSV(csvFormatData, 'My Report');
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
