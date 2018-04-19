import { Component, Input, OnChanges, OnInit, ElementRef, ViewChild, SimpleChanges, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Http, Headers, RequestOptions } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { mediaDetail } from '../model/feedback.model';
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
import { AccessDataModelComponent } from '../model/useraccess.data.model';
import { SmsTemplateSelectService } from './sms-template-select-service';
import { ISmsTemplateData } from '../model/smsTemplateData';
import { PapaParseService } from 'ngx-papaparse';
import CSVExportService from 'json2csvexporter';
import { ICsvData } from '../model/emailThemeConfig.model';
import { isNumber } from 'util';
import { MessageArchivedComponent } from '../directives/snackbar-sms-email/snackbar-email-sms';
@Component({
  selector: 'app-smsui',
  templateUrl: './smsui.component.html',
  styleUrls: ['./smsui.component.scss']
})
export class SmsuiComponent implements OnInit {
  errorPhoneContacts = [];
  filteredPhoneContacts = [];
  phoneContactsArray: ICsvData[];
  selectedSmsTemplateData: any;
  smsTemplateSelectionData: any;
  @Input() title: any;
  filteredUserAccessData: any;
  userAccessLevelObject: any;
  template = `<img src="../assets/icons/loader.gif" />`;
  smsContactForm: any;
  PHONE_REGEXP = /^([0]|\+91)?[789]\d{9}$/;
  submitted: boolean;
  cancelFileEdit: boolean;
  userAccessDataModel: AccessDataModelComponent;
  feature_id = 4;
  constructor(private spinnerService: Ng4LoadingSpinnerService, private httpClient: HttpClient,
    private formBuilder: FormBuilder, private alertService: AlertService,
    public adminComponent: AdminComponent, private router: Router,
    public smsSelectionService: SmsTemplateSelectService,
    public dialog: MatDialog,
    private papa: PapaParseService,
    public snackBar: MatSnackBar) {
    this.smsContactForm = this.formBuilder.group({
      'phone': ['', Validators.compose([Validators.required, Validators.pattern(this.PHONE_REGEXP)])],
      'message': ['', [Validators.required, Validators.minLength(10)]],
      'check': [''],
      'file': [''],
      'client_id': []
    });
    this.getSlectedTemplateData();
    if (Number(localStorage.getItem('feature_id')) !== this.feature_id) {
      this.userAccessDataModel = new AccessDataModelComponent(httpClient, router);
      this.userAccessDataModel.setUserAccessLevels(null, this.feature_id, 'admin/sms');
    }
    this.phoneContactsArray = [];
    this.errorPhoneContacts = [];
  }
  ngOnInit() {
    setTimeout(function () {
      this.spinnerService.hide();
    }.bind(this), 3000);
  }
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
          try {
            if ((!data.error) && (data.custom_status_code = 100)) {
              this.smsTemplateSelectionData = data.result;
              this.smsTemplateSelectionData.map((smsData) => {
                smsData.isActive = false;
              });
              console.log(this.smsTemplateSelectionData);
            }
          } catch (e) {
            console.log(e);
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
        console.log(result);
        this.selectedSmsTemplateData = result;
        console.log(this.selectedSmsTemplateData);
      } else {
        console.log('no template was selected');
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
    console.log(this.phoneContactsArray);
    if (this.phoneContactsArray.length > 0) {
      this.phoneContactsArray.map((item, index) => {
        if (item.Phone) {
          if (item.Phone !== '' && item.Phone.match(this.PHONE_REGEXP) != null) {
            this.filteredPhoneContacts.push(item);
          } else {
            this.errorPhoneContacts.push(index);
          }
        }
      });
    }
    if (this.errorPhoneContacts.length > 0) {
      event.target.value = null;
    }
    this.smsContactForm.get('file').setValue(this.filteredPhoneContacts);
    event.target.value = null;
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
    // return this.emailContactsArray;
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
