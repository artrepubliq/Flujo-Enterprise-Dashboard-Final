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


@Component({
  selector: 'app-smsui',
  templateUrl: './smsui.component.html',
  styleUrls: ['./smsui.component.scss']
})
export class SmsuiComponent implements OnInit {
  smsContactForm:any;
  constructor(private http: HttpClient,private httpService: HttpService, private formBuilder: FormBuilder, private alertService: AlertService) {
    this.smsContactForm = this.formBuilder.group({
      'phone': ['', [Validators.required, ValidationService.phoneValidator]],
      'message': ['', [Validators.required, Validators.minLength(10)]],
      'check': [''],
      'file': [''],
      'client_id':[]   
    })
   }
  
  ngOnInit() {
  }

  smsContactFormSubmit(){
    console.log(this.smsContactForm.value);
    this.smsContactForm.controls['client_id'].setValue(localStorage.getItem("client_id"));
    this.httpService.create(this.smsContactForm.value, "/sendsms")
      .subscribe(
      data => {

        if (data) {
          this.alertService.success('Message has been sent successfully');
        }else{
        this.alertService.success('Message not sent');
        }
      },
      error => {
        console.log(error);
      })
  }
  socialLinksFormSubmit(body: any) {

    
  }
}
