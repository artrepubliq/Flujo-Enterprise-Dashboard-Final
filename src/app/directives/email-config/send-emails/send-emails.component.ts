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
import { BASE_ROUTER_CONFIG } from '../../../app.router-contstants';
// import grapesjs from 'grapesjs';
declare var require: any;
// declare var grapesjs: any;
// import grapesjs from 'grapesjs';
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
  EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
  public campaignListDetails: ICampaignListDetails[];
  public ngUnSubScribe = new Subject();
  public domain: IDomain;
  public from: string;
  htmlString = `<h1>Please design your email template or choose from templates</h1>`;
  selectedEmailTemplateHtml: any;
  globalEditor: any;

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
      'message': [''],
      'from': [''],
      'file': [null],
      'check': [''],
      'client_id': null
    });
    this.editorValue = '';
    this.getEmailTemplateData();
    this.emailContactsArray = [];
    this.errorEmailContacts = [];
    this.multipleEmails = true;
    // this.initEditor();
  }

  ngOnInit() {

    this.initEditor(this.htmlString);
    setTimeout(function () {
      this.spinnerService.hide();
    }.bind(this), 3000);
    this.spinnerService.show();
    this.emailService.getMailgunSmtpDetails().subscribe(
      result => {
        this.spinnerService.hide();
        if (result.error === false && result.data && result.data.length > 0) {
          this.domain = JSON.parse(result.data[0].domain);
          if (this.domain.smtp_login.includes('flujo.')) {
            this.from = `no-reply@${this.domain.smtp_login.split('flujo.')[1]}`;
          } else {
            this.from = `no-reply@sarvodaya.ngo`;
          }
        }
      },
      error => {
        this.spinnerService.hide();
        console.log(error);
      });

    /**
     * this is to get Campaign details from Database
     */
    this.emailService.getCampainDetailsOfClient().subscribe(
      result => {
        this.spinnerService.hide();
        if (result.error === false && result.data && result.data.length > 0) {
          const campaignList = result.data;
          this.campaignListDetails = campaignList;
        }
      },
      error => {
        this.spinnerService.hide();
        console.log(error);
      }
    );
  }
  initEditor = (emailDataOfSelected) => {
    this.spinnerService.hide();
    const grapesjs = require('grapesjs');
    const nlPlugin = require('grapesjs-preset-newsletter');
    grapesjs.plugins.add('gjs-preset-newsletter-3', nlPlugin.default);
    const editor = grapesjs.init({
      container: '#gjs',
      fromElement: true,
      height: '60vh',
      storageManager: { autoload: 0 },
      plugins: ['gjs-preset-newsletter-3', 'gjs-aviary'],
      pluginsOpts: {
        'gjs-preset-newsletter-3': {
          modalLabelImport: 'Paste all your code here below and click import',
          modalLabelExport: 'Copy the code and use it wherever you want',
          codeViewerTheme: 'material',
          importPlaceholder: '<table class="table"><tr><td class="cell">Hello world!</td></tr></table>',
          cellStyle: {
            'font-size': '12px',
            'font-weight': 300,
            'vertical-align': 'top',
            color: 'rgb(111, 119, 125)',
            margin: 0,
            padding: 0,
          }
        },
        'gjs-aviary': {}
      },
      assetManager: {
        embedAsBase64: 1,
        upload: 'https://test.page',
        params: {
          _token: 'pCYrSwjuiV0t5NVtZpQDY41Gn5lNUwo3it1FIkAj',
        },
        assets: [
          { type: 'image', src: 'http://placehold.it/350x250/78c5d6/fff/image1.jpg', height: 350, width: 250 },
          { type: 'image', src: 'http://placehold.it/350x250/459ba8/fff/image2.jpg', height: 350, width: 250 },
          { type: 'image', src: 'http://placehold.it/350x250/79c267/fff/image3.jpg', height: 350, width: 250 },
          { type: 'image', src: 'http://placehold.it/350x250/c5d647/fff/image4.jpg', height: 350, width: 250 },
          { type: 'image', src: 'http://placehold.it/350x250/f28c33/fff/image5.jpg', height: 350, width: 250 },
          { type: 'image', src: 'http://placehold.it/350x250/e868a2/fff/image6.jpg', height: 350, width: 250 },
          { type: 'image', src: 'http://placehold.it/350x250/cc4360/fff/image7.jpg', height: 350, width: 250 },
          { type: 'image', src: 'http://placehold.it/350x250/cc4360/fff/image7.jpg', date: '2015-02-01', height: 1080, width: 1728 },
          { type: 'image', src: 'http://placehold.it/350x250/cc4360/fff/image7.jpg', date: '2015-02-01', height: 650, width: 320 },
          { type: 'image', src: 'http://placehold.it/350x250/cc4360/fff/image7.jpg', date: '2015-02-01', height: 1, width: 1728 },
        ]
      },
    });
    this.globalEditor = editor;
    // const interval = setInterval(() => {
    //   this.selectedEmailTemplateHtml = editor.getHtml() + `<style>${editor.getCss()}</style>`;
    //   console.log(this.selectedEmailTemplateHtml);
    // }, 3000);
    editor.setComponents(emailDataOfSelected);
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
  public mailSendingFormSubmit() {
    this.selectedEmailTemplateHtml = this.globalEditor.runCommand('gjs-get-inlined-html');
    this.mailSendingForm.controls['from'].setValue(this.from);
    this.mailSendingForm.controls['message'].setValue(this.selectedEmailTemplateHtml);
    // console.log(this.mailSendingForm.value);
    // console.log(this.domain);
    if (this.mailSendingForm.controls['message'].value !== '') {
      this.spinnerService.show();
      console.log(this.mailSendingForm.value);
      this.emailService.sendEmail(this.mailSendingForm.value).subscribe(
        result => {
          this.alertService.success('Email has been sent to the mail list');
          this.mailSendingForm.reset();
          console.log(result);
          this.spinnerService.hide();
        },
        error => {
          this.spinnerService.hide();
          console.log(error);
        });
    }
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
        this.initEditor(this.selectedEmailTemplateData);
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
      { 'test@something.in': 'test1@somthing.com', 'test2@something.in': 'test4@something.in' },
    ];
    const exporter = CSVExportService.create();
    exporter.downloadCSV(csvFormatData, 'My Report');
  }
  configureBulkEmail = () => {
    this.router.navigate(['admin/' + BASE_ROUTER_CONFIG.F_4_SF_1.token]);
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
