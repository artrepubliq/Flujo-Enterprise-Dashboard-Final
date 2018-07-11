import { Component, OnChanges, OnInit, ElementRef, ViewChild, SimpleChanges, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../../service/httpClient.service';
import { ValidationService } from '../../../service/validation.service';
import { AlertModule, AlertService } from 'ngx-alerts';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { NgxSmartLoaderService } from 'ngx-smart-loader';
import { AdminComponent } from '../../../admin/admin.component';
import { Router } from '@angular/router';
import * as _ from 'underscore';
import { AccessDataModelComponent } from '../../../model/useraccess.data.model';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { EmailTemplateService } from '../../../email-template/email-template-service';
import { AppConstants } from '../../../app.constants';
import { IPostEmailTemplate, ICsvData } from '../../../model/emailThemeConfig.model';
import { PapaParseService } from 'ngx-papaparse';
import CSVExportService from 'json2csvexporter';
import { ICommonInterface } from '../../../model/commonInterface.model';
import { MessageArchivedComponent } from '../../../directives/snackbar-sms-email/snackbar-email-sms';
import { EmailConfigService } from '../../../service/email-config.service';
import { resource } from 'selenium-webdriver/http';
import { ICampaignListDetails, IDomain } from '../../../model/email.config.model';
import { Subject } from 'rxjs/Subject';
@Component({
  selector: 'app-send-emails',
  templateUrl: './send-emails.component.html',
  styleUrls: ['./send-emails.component.scss']
})
export class SendEmailsComponent implements OnInit {
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
  public campaignListDetails: ICampaignListDetails[];
  public ngUnSubScribe = new Subject();
  public domain: IDomain;
  public from: string;

  constructor(public loader: NgxSmartLoaderService, private spinnerService: Ng4LoadingSpinnerService,
    private formBuilder: FormBuilder,
    private httpService: HttpService, private alertService: AlertService, public adminComponent: AdminComponent,
    private router: Router,
    public dialog: MatDialog, private httpClient: HttpClient,
    private emailTemplateService: EmailTemplateService,
    private papa: PapaParseService,
    private emailService: EmailConfigService,
    public snackBar: MatSnackBar) {
    this.feature_id = 3;
    this.mailSendingForm = this.formBuilder.group({
      'email': ['', Validators.compose([Validators.required])],
      'subject': ['', Validators.required],
      'message': ['', Validators.required],
      'from': [''],
      'file': [null],
      'check': [''],
      'client_id': null
    });
    this.editorValue = '';
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
    /**
     * this is to get campaign details from the service
     */
    this.emailService.getCampaignDetails().takeUntil(this.ngUnSubScribe).subscribe(
      result => {
        this.campaignListDetails = result;
      },
      error => {
        console.log(error);
      }
    );

    this.emailService.getSmtpUserDetails().takeUntil(this.ngUnSubScribe).subscribe(
      result => {
        if (result.error === false) {
          this.domain = JSON.parse(result.data[0].domain);
          this.from = this.domain.smtp_login;
        }
      }
    );
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

  /**
   * @param body this takes the email body subject details etc
   */
  public mailSendingFormSubmit(body: any) {
    this.mailSendingForm.controls['from'].setValue(this.from);
    this.emailService.sendEmail(this.mailSendingForm.value).subscribe(
      result => {
        this.alertService.success('Email has been sent to the mail list');
        this.mailSendingForm.reset();
        console.log(result);
      },
      error => {
        this.alertService.warning('Somethig went wrong!');
        console.log(error);
      });
  }
  /*Getting of email template data from api using emailTemplateService*/
  getEmailTemplateData = (): void => {
    this.spinnerService.show();
    this.emailTemplateService.getTemplateConfigData('flujo_client_getemailtemplateconfig/', AppConstants.CLIENT_ID)
      .subscribe(
        data => {
          this.spinnerService.hide();
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
    const dialogRef = this.dialog.open(EmailTemplateSelectionModal, {
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
      { Email: 'test@flujo.in' },
      { Email: 'test1@flujo.in' },
      { Email: 'test2@flujo.in' }
    ];
    const exporter = CSVExportService.create();
    exporter.downloadCSV(csvFormatData, 'My Report');
  }
}
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'email-select-popup.html',
  styleUrls: ['./send-emails.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class EmailTemplateSelectionModal {
  config: any;
  selectedEmailTemplateData: IPostEmailTemplate[];
  constructor(
    public dialogRef: MatDialogRef<EmailTemplateSelectionModal>,
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
