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
import { IGalleryObject } from '../model/gallery.model';
import { IGalleryImages } from '../model/gallery.model';
import { ValidationService } from '../service/validation.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-smsui',
  templateUrl: './smsui.component.html',
  styleUrls: ['./smsui.component.scss']
})
export class SmsuiComponent implements OnInit {
  template: string =`<img src="../assets/icons/loader.gif" />`
  smsContactForm:any;
  constructor(private spinnerService: Ng4LoadingSpinnerService,private http: HttpClient,private httpService: HttpService, private formBuilder: FormBuilder, private alertService: AlertService) {
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
    console.log(this.smsContactForm.value);
    this.smsContactForm.controls['client_id'].setValue(localStorage.getItem("client_id"));
    this.httpService.create(this.smsContactForm.value, "/flujo_client_sendsms")
      .subscribe(
      data => {

        if (data) {
          this.alertService.success('Message has been sent successfully');
          this.smsContactForm.reset();
        }else{
        this.alertService.danger('Message not sent');
        this.smsContactForm.reset();
        }
      },
      error => {
        console.log(error);
      })
  }
  socialLinksFormSubmit(body: any) {

    
  }
}
