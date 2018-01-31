import { Component, OnInit, ElementRef, ViewChild, SimpleChanges } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Http, Headers, RequestOptions } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { mediaDetail } from '../model/feedback.model';
import { AlertModule, AlertService } from 'ngx-alerts';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { FileUploadModule } from "ng2-file-upload";
import { MatButtonModule } from '@angular/material';
import { HttpService } from '../service/httpClient.service';

import { ValidationService } from '../service/validation.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AppConstants } from '../app.constants';
@Component({
  selector: 'app-smsui',
  templateUrl: './smsui.component.html',
  styleUrls: ['./smsui.component.scss']
})
export class SmsuiComponent implements OnInit {
  template: string =`<img src="../assets/icons/loader.gif" />`
  smsContactForm:any;
  constructor(private spinnerService: Ng4LoadingSpinnerService,private httpClient: HttpClient, private formBuilder: FormBuilder, private alertService: AlertService) {
    this.smsContactForm = this.formBuilder.group({
      'phone': ['', [Validators.required, ValidationService.phoneValidator]],
      'message': ['', [Validators.required, Validators.minLength(10)]],
      'check': [''],
      'file': [''],
      'client_id':[]   
    })
   }
  
  ngOnInit() {
    setTimeout(function() {
      this.spinnerService.hide();
    }.bind(this), 3000);
  }

  smsContactFormSubmit(){
    this.spinnerService.show();
    console.log(this.smsContactForm.value);
    this.smsContactForm.controls['client_id'].setValue(AppConstants.CLIENT_ID);
    this.httpClient.post(AppConstants.API_URL+"flujo_client_sendsms",this.smsContactForm.value)
      .subscribe(
      data => {
          this.spinnerService.hide();
        if (data) {

          this.alertService.success('Message has been sent successfully');
          this.smsContactForm.reset();
          this.smsContactForm.message=null;
        }else{
        this.alertService.danger('Message not sent');
        this.smsContactForm.reset();
        this.smsContactForm.message=null;
        }
      },
      error => {
        this.spinnerService.hide();
        console.log(error);
      })
  }
  socialLinksFormSubmit(body: any) {

    
  }
}
