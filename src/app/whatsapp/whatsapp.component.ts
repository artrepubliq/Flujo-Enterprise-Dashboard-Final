import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { SmsTemplateSelectService } from '../smsui/sms-template-select-service';
import { AppConstants } from '../app.constants';
import { ISmsTemplateData } from '../model/smsTemplateData';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IHttpResponse } from '../model/httpresponse.model';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AlertService } from 'ngx-alerts';
import { ICommonInterface } from '../model/commonInterface.model';
@Component({
  selector: 'app-whatsapp',
  templateUrl: './whatsapp.component.html',
  styleUrls: ['./whatsapp.component.scss']
})
export class WhatsappComponent implements OnInit {
  whatsAppSendingForm: FormGroup;
  totalWhatsAppTemplateData: any;
  whatsAppTemplateData: ISmsTemplateData[];
  dropDownData: Object;
  constructor(private httpClient: HttpClient,
    public dialog: MatDialog,
    public smsSelectTemplateService: SmsTemplateSelectService,
    private formBuilder: FormBuilder,
    private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertService) {
    this.whatsAppSendingForm = formBuilder.group({
      'database': [null],
      'group': [null],
      'message': [],
      'client_id': [null]
    });
    this.getWhatsAppSmsTemplateData();
  }

  ngOnInit() {
  }
  submitwhatsAppSendingForm = () => {
    this.spinnerService.show();
    this.whatsAppSendingForm.controls['client_id'].setValue(AppConstants.CLIENT_ID);
    const formModel = this.whatsAppSendingForm.value;
    this.httpClient.post<ICommonInterface>(AppConstants.API_URL + 'flujo_client_sendwhatsapp', formModel)
    .subscribe(
      data => {
        if (!data.error) {
          this.spinnerService.hide();
          this.alertService.info('Message has been sent successfully');
          this.whatsAppSendingForm.reset();
        } else {
          this.alertService.danger('Message not sent');
        }
      }
    );
  }
  getWhatsAppSmsTemplateData = () => {
    this.smsSelectTemplateService.getSmsSelectData('/flujo_client_getsmstemplateconfig/', AppConstants.CLIENT_ID)
      .subscribe(
        result => {
          if ((result.custom_status_code = 100) && (!result.error)) {
          this.whatsAppTemplateData = result.result;
          this.whatsAppTemplateData.map((templateData) => {
            templateData.isActive = false;
          });
        }
        }, error => {
          console.log(error);
        }
      );
  }
  templateSelectionPopup = () => {
    const dialogRef = this.dialog.open(WhatsAppTemplatePopup, {
      width: '45vw',
      height: '60vh',
      data: this.whatsAppTemplateData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.totalWhatsAppTemplateData = result;
      } else {
        console.log('no template was selected');
      }
    });
  }
}
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'whatsapp-template-popup.html',
  styleUrls: ['./whatsapp.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class WhatsAppTemplatePopup {

  totalWhatsAppTemplateData: string;
  constructor(
    public dialogRef: MatDialogRef<WhatsAppTemplatePopup>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  selectedWhatsAppText = (selectedWhatsAppData, i) => {
    this.data.map((smsData) => {
      smsData.isActive = false;
    });
    selectedWhatsAppData.isActive = true;
    this.totalWhatsAppTemplateData = selectedWhatsAppData.template_text;
  }
  /*Sending the selected data to assign in form of sms submission*/
  closeDialog = () => {
    this.dialogRef.close(this.totalWhatsAppTemplateData);
    this.data.map((smsData) => {
      smsData.isActive = false;
    });
  }
  cancelDialog = () => {
    this.dialogRef.close();
    this.data.map((smsData) => {
      smsData.isActive = false;
    });
  }
}
