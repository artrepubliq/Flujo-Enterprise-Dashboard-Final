import { Component, Input, OnChanges, OnInit, ElementRef, ViewChild, SimpleChanges, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Http, Headers, RequestOptions } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertModule, AlertService } from 'ngx-alerts';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { FileUploadModule } from 'ng2-file-upload';
import { MatButtonModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material';
import { HttpService } from '../service/httpClient.service';
import { ValidationService } from '../service/validation.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AppConstants } from '../app.constants';
import { AdminComponent } from '../admin/admin.component';
import { Router } from '@angular/router';
import * as _ from 'underscore';
import { SmsTemplateSelectService } from './sms-template-select-service';
import { ISmsTemplateData } from '../model/smsTemplateData';
import { PapaParseService } from 'ngx-papaparse';
import CSVExportService from 'json2csvexporter';
import { ICsvData } from '../model/emailThemeConfig.model';
import { isNumber } from 'util';
import { MessageArchivedComponent } from '../directives/snackbar-sms-email/snackbar-email-sms';
import { ICommonInterface } from '../model/commonInterface.model';
import { GloblalSmsService } from '../service/global-sms.service';
import { ISMSResponse, IGetSenderIds } from '../model/twitter/sms.gateway.model';
import { countryCodes } from './countries';
@Component({
  selector: 'app-smsui',
  templateUrl: './smsui.component.html',
  styleUrls: ['./smsui.component.scss']
})
export class SmsuiComponent implements OnInit {
  selectedSMSSenderId: any;
  multipleNumbers: boolean;
  errorInFormat = false;
  errorPhoneContacts = [];
  filteredPhoneContacts = [];
  phoneContactsArray: ICsvData[];
  selectedSmsTemplateData: any;
  smsTemplateSelectionData: any;
  @ViewChild('file') file: ElementRef;
  @Input() title: any;
  filteredUserAccessData: any;
  userAccessLevelObject: any;
  template = `<img src="../assets/icons/loader.gif" />`;
  smsContactForm: any;
  PHONE_REGEXP = /^([0]|\+91)?[6789]\d{9}$/;
  submitted: boolean;
  cancelFileEdit: boolean;
  feature_id = 4;

  public createAccountForm: FormGroup;
  public sendSms = false;
  public createSenderIdForm: FormGroup;
  showSenderCreation = false;
  // senderIds: IGetSenderIds[];
  // public uppercase
  public senderIds: IGetSenderIds[];
  public sms_plans = ['Promotional', 'Transactional'];
  public creation_message = 'Dear SMSGatewayHub, Please Approve the following sender id';
  public countryNames: { name: string, dial_code: string, code: string }[];
  public cap_reg_ex = /\b([A - Z]+)\b/;
  public subject = 'Sender Id approval';
  agreementFile: any;
  @Input() fileExt = 'DOCX, DOC';
  @Input() maxSize = 1;
  errors: Array<string> = [];
  // senderIdDetails: IGetSenderIds[];
  constructor(private spinnerService: Ng4LoadingSpinnerService, private httpClient: HttpClient,
    private formBuilder: FormBuilder, private alertService: AlertService,
    public adminComponent: AdminComponent, private router: Router,
    public smsSelectionService: SmsTemplateSelectService,
    public dialog: MatDialog,
    private papa: PapaParseService,
    private smsService: GloblalSmsService,
    public snackBar: MatSnackBar) {
    this.smsContactForm = this.formBuilder.group({
      'phone': ['', Validators.compose([Validators.required])],
      'message': ['', [Validators.required, Validators.minLength(10)]],
      'check': [''],
      'file': [''],
      'client_id': [''],
      'sender_id': ['', Validators.required]
    });
    this.createSenderIdForm = this.formBuilder.group({
      // 'website_name': ['', Validators.required],
      // 'company_name': ['', Validators.required],
      'sender_id': ['', Validators.compose(
        [
          Validators.required,
          // Validators.pattern(this.cap_reg_ex),
          Validators.maxLength(6),
          Validators.minLength(6),
        ]
      )],
      'client_id': [''],
      'creation_message': [''],
      'subject': [''],
      'user_name': ['', Validators.required],
      'sms_plan': ['', Validators.required],
      'country_name': ['', Validators.required],
      'website_url': ['', Validators.required]
    });

    this.getSlectedTemplateData();
    this.phoneContactsArray = [];
    this.errorPhoneContacts = [];
    this.multipleNumbers = true;

    /** this is to create account for client to use sms */
    this.createAccountForm = this.formBuilder.group({
      'account_name': ['', Validators.required],
      'client_id': [AppConstants.CLIENT_ID, Validators.required],
    });

  }
  ngOnInit() {
    setTimeout(function () {
      this.spinnerService.hide();
    }.bind(this), 3000);
    this.countryNames = countryCodes;
    this.smsService.getSMSSenderIds(AppConstants.CLIENT_ID).subscribe(
      result => {
        // console.log(result);
        if (!result.error && result.custom_status_code === 100) {
          this.senderIds = result.result;
        }
      },
      error => {
        // console.log(error);
      });
  }
  public checkValidNumbers(event) {
    if (event != null) {
      const numbersArray = event.split(',');
      const errorNumbers = [];
      numbersArray.map(item => {
        if (item !== '' && item.match(this.PHONE_REGEXP) === null) {
          errorNumbers.push(item);
        }
      });
      if (errorNumbers.length > 0) {
        this.multipleNumbers = false;
      } else {
        this.multipleNumbers = true;
      }
      // // console.log(errorNumbers);
      // // console.log(this.multipleNumbers);
    }
  }
  public smsContactFormSubmit(): void {
    this.spinnerService.show();
    // console.log(this.smsContactForm.value);
    this.smsContactForm.controls['client_id'].setValue(AppConstants.CLIENT_ID);
    this.smsContactForm.controls['sender_id'].setValue(this.selectedSMSSenderId);
    this.httpClient.post<ICommonInterface>(AppConstants.API_URL + 'flujo_client_sendsmsdbcsv', this.smsContactForm.value)
      .subscribe(
      data => {
        // console.log(data);
        this.spinnerService.hide();
        if ((!data.error) && (data.custom_status_code = 100)) {
          this.alertService.success('Message has been sent successfully');
          this.smsContactForm.reset();
          this.file.nativeElement.value = null;
        } else if (data.custom_status_code = 101) {
          this.alertService.danger('Required parameters are missing');
          this.smsContactForm.reset();
        }
      },
      error => {
        this.spinnerService.hide();
        // console.log(error);
      });
  }
  cancelSmsEdit = () => {
    this.smsContactForm.reset();
  }
  /* Geting the data from api using sms template selection service */
  getSlectedTemplateData = () => {
    this.smsSelectionService.getSmsSelectData('flujo_client_getsmstemplateconfig/', AppConstants.CLIENT_ID)
      .subscribe(
      data => {
        try {
          if ((!data.error) && (data.custom_status_code = 100)) {
            this.smsTemplateSelectionData = data.result;
            this.smsTemplateSelectionData.map((smsData) => {
              smsData.isActive = false;
            });
            // console.log(this.smsTemplateSelectionData);
          }
        } catch (e) {
          // console.log(e);
        }
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
        this.selectedSmsTemplateData = result;
      } else {
        // console.log('no template was selected');
      }
    });
  }
  async getContactsFromCsv(event) {
    // this.phoneContactsArray = [];
    this.errorPhoneContacts = [];
    this.filteredPhoneContacts = [];
    const fileReader = new FileReader;
    const file = event.target.files[0];
    const csvPhoneData = file;
    this.phoneContactsArray = await this.getCsvData(csvPhoneData);
    // console.log(this.phoneContactsArray);
    if (this.phoneContactsArray.length > 0) {
      this.phoneContactsArray.map((item, index) => {
        if (item.Phone) {
          if (item.Phone !== '' && item.Phone.match(this.PHONE_REGEXP) != null) {
            this.filteredPhoneContacts.push(item);
          } else {
            this.errorPhoneContacts.push(index);
            this.errorInFormat = true;
          }
        } else {
          // console.log('the uploaded format not follwoing our standards');
          const snackBarRef = this.snackBar.open('The uploaded format not follwoing our standards', '', {
            duration: 3000,
            extraClasses: ['alert-snackbar']
          });
        }
      });
    }
    if (this.errorPhoneContacts.length > 0) {
      this.errorInFormat = true;
    }
    this.smsContactForm.get('file').setValue(this.filteredPhoneContacts);
  }
  getCsvData(csvPhonelData): Promise<any> {
    return new Promise((resolve, reject) => {
      this.papa.parse(csvPhonelData, {
        header: true,
        complete: (results) => {
          resolve(results.data);
        }
      });
    });
  }
  continue() {
    this.errorInFormat = false;
  }
  rectify() {
    this.errorInFormat = false;
    this.file.nativeElement.value = null;
  }
  downLoadPhoneCsvFormat = () => {
    const csvPhoneFormatData = [
      { Name: 'Test', Phone: '9281982910' },
      { Name: 'Test', Phone: '9281982910' },
      { Name: 'Test', Phone: '9281982910' }
    ];
    const exporter = CSVExportService.create();
    exporter.downloadCSV(csvPhoneFormatData);
  }


  // this is to create sender id
  createSenderId = () => {
    this.showSenderCreation = true;
  }

  onSubmitSenderId(): void {
    this.createSenderIdForm.controls['client_id'].setValue(AppConstants.CLIENT_ID);
    this.createSenderIdForm.controls['subject'].setValue(this.subject);
    this.createSenderIdForm.controls['sender_id'].setValue(this.createSenderIdForm.controls['sender_id'].value.toUpperCase());
    this.createSenderIdForm.controls['creation_message'].setValue(
      `<p>Dear SMSGatewayHub,</p>

      <p>Please approve a sender id with the following details</p>

      <p>Sender ID : <b>${this.createSenderIdForm.controls['sender_id'].value},</b><br>
        Country Name : <b>${this.createSenderIdForm.controls['country_name'].value},</b><br>
        Type : <b>${this.createSenderIdForm.controls['sms_plan'].value},</b><br>
        User Name : <b>${this.createSenderIdForm.controls['user_name'].value}</b><br>
        Website URL : <b>${this.createSenderIdForm.controls['website_url'].value}</b></p>
        <p><b><u>Sample Text :</u></b>
        <br><br> Dear User,<br> Please participate in our program at our office to donate.</p>
      <br>
      <p>
      Regards,<br>
      Flujo Team
      </p>`);
    const formData = new FormData();
    formData.append('client_id', this.createSenderIdForm.controls['client_id'].value);
    formData.append('subject', this.createSenderIdForm.controls['subject'].value);
    formData.append('sender_id', this.createSenderIdForm.controls['sender_id'].value);
    formData.append('creation_message', this.createSenderIdForm.controls['creation_message'].value);
    formData.append('agreement_file', this.agreementFile);
    if (this.agreementFile && this.errors.length === 0) {
      this.spinnerService.show();
      // console.log(this.createSenderIdForm.value);
      this.smsService.createSenderId(formData).subscribe(
        result => {
          this.spinnerService.hide();
          // this.createSenderIdForm.reset();
          // console.log(result);
          if (result.error === false && result.status === 100) {
            this.showSenderCreation = false;
            this.alertService.info('Request for creating senderId has been initiated succesfully!');
          } else if (result.error && (result.status === 105 || result.status === 104)) {
            this.alertService.warning(result.data);
          } else {
            this.alertService.warning('Something went wrong!');
          }
          this.spinnerService.hide();
        },
        error => {
          this.spinnerService.hide();
          // console.log(error);
        });
    }
  }

  onFileChange = (event) => {
    this.errors = [];
    this.agreementFile = event.target.files[0];
    // // console.log(event.target.files[0]);
    this.isValidFileExtension(this.agreementFile);
  }

  private isValidFileExtension(file) {
    // Make array of file extensions
    const extensions = (this.fileExt.split(','))
      .map(function (x) { return x.toLocaleUpperCase().trim(); });

    // Get file extension
    const ext = file.name.toUpperCase().split('.').pop() || file.name;
    // Check the extension exists
    const exists = extensions.includes(ext);
    if (!exists) {
      this.alertService.warning('Error (Extension): ' + file.name);
      this.errors.push('Error (Extension): ' + file.name);
      return;
    }
    // Check file size
    this.isValidFileSize(file);

  }

  /* this is for checking valid size of the file */
  private isValidFileSize(file) {
    const fileSizeinMB = file.size / (1024 * 1000);
    const size = Math.round(fileSizeinMB * 100) / 100; // convert upto 2 decimal place
    if (size > this.maxSize) {
      this.alertService.warning('Error (File Size): ' + file.name + ': exceed file size limit of '
        + this.maxSize + 'MB ( ' + size + 'MB )');
      this.errors.push('Error (File Size): ' + file.name + ': exceed file size limit of '
        + this.maxSize + 'MB ( ' + size + 'MB )');
    }
  }
  // hide creating sender id
  cancel(): void { this.showSenderCreation = !this.showSenderCreation; }

  selectSenderID = (senderIdItem) => {

    this.selectedSMSSenderId = senderIdItem.sender_id;
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
    @Inject(MAT_DIALOG_DATA) public data: any) {
    dialogRef.disableClose = true;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  selectedSmsText = (selectedSmsData, i) => {
    this.data.map((smsData) => {
      smsData.isActive = false;
    });
    selectedSmsData.isActive = true;
    this.totalSmsTemplateData = selectedSmsData.template_text;
    // console.log(this.totalSmsTemplateData);
  }
  /*Sending the selected data to assign in form of sms submission*/
  closeDialog = () => {
    this.dialogRef.close(this.totalSmsTemplateData);
  }
  cancelDialog = () => {
    this.dialogRef.close();
  }
}
