import { Component, OnInit,ElementRef, ViewChild } from '@angular/core';
import { CKEditorModule } from 'ngx-ckeditor';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { HttpService } from '../service/httpClient.service';
import { ValidationService } from '../service/validation.service';
import { AlertModule, AlertService } from 'ngx-alerts';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { NgxSmartLoaderService } from 'ngx-smart-loader';

@Component({
  selector: 'app-emailservice',
  templateUrl: './emailservice.component.html',
  styleUrls: ['./emailservice.component.scss']
})
export class EmailserviceComponent implements OnInit {
  mailSendingForm: FormGroup;
  socialLinksForm: FormGroup;
  public loading:false;
  EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
  constructor(public loader: NgxSmartLoaderService,private spinnerService: Ng4LoadingSpinnerService,private formBuilder: FormBuilder, private httpService: HttpService, private alertService: AlertService) {
    this.mailSendingForm = this.formBuilder.group({
      'email': ['', Validators.compose([Validators.required, Validators.pattern(this.EMAIL_REGEXP)])],
      'subject': ['', Validators.required],
      'message': ['', Validators.required],
      'file':[null],
      'check':[''],
      'client_id': null
    });
   }

  ngOnInit() {
    setTimeout(function() {
      this.spinnerService.hide();
    }.bind(this), 3000);
  }

  // socialLinksFormSubmit(body: any) {
  //   console.log(this.socialLinksForm.value);
  // }
  onFileChange(event) {
    if(event.target.files.length > 0) {
      let file = event.target.files[0];
      this.mailSendingForm.get('file').setValue(file);
    }
  }
  mailSendingFormSubmit(body: any) {
    this.spinnerService.show();
    console.log(this.mailSendingForm.value);
    //this.mailSendingForm.controls['client_id'].setValue(localStorage.getItem("client_id"));
    this.httpService.create(this.mailSendingForm.value, "/flujo_client_emailcsvdb")
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
      })
  }
}
