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
  
  constructor(public loader: NgxSmartLoaderService,private spinnerService: Ng4LoadingSpinnerService,private formBuilder: FormBuilder, private httpService: HttpService, private alertService: AlertService) {
    this.mailSendingForm = this.formBuilder.group({
      'email': ['', [Validators.required, ValidationService.emailValidator]],
      'subject': ['', Validators.required],
      'message': ['', Validators.required],
      'file':[''],
      'check':[''],
      'client_id': null
    });

    // this.socialLinksForm = this.formBuilder.group({
    //  'email_text_two': ['', [Validators.required, ValidationService.emailValidator]],      
    //   'facebook': ['', [Validators.required, ValidationService.domainValidator]],
    //   'twitter': ['', [Validators.required, ValidationService.domainValidator]],
    //   'wikipedia': ['', [Validators.required, ValidationService.domainValidator]],
    //   'youtube': ['', [Validators.required, ValidationService.domainValidator]],
    //   'client_id': null
    // });

    // console.log(this.socialLinksForm); 
   }

  ngOnInit() {
    setTimeout(function() {
      this.spinnerService.hide();
    }.bind(this), 3000);
  }

  // socialLinksFormSubmit(body: any) {
  //   console.log(this.socialLinksForm.value);
  // }

  mailSendingFormSubmit(body: any) {
    console.log(this.mailSendingForm.value);
    this.mailSendingForm.controls['client_id'].setValue(localStorage.getItem("client_id"));
    this.httpService.create(this.mailSendingForm.value, "/flujo_client_emailcsvdb")
      .subscribe(
      data => {

        if (data) {
          this.alertService.success('Social Links  Updated Successfully');
          
          this.mailSendingForm.reset()
        }

      },
      error => {
        console.log(error);
      })
  }
}
