
import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { HttpService } from '../service/httpClient.service';
import { ValidationService } from '../service/validation.service';
import { AlertModule, AlertService } from 'ngx-alerts';

@Component({
  templateUrl: './smtpconfiguration.component.html',
  styleUrls: ['./smtpconfiguration.component.scss']
})
export class SMTPConfigurationComponent { 
  smtpUpdationForm: FormGroup;
  btn_text: string = "save";
  smtpItems: any;
  public isEdit: boolean = false;
  constructor(private formBuilder: FormBuilder, private httpService: HttpService, private alertService: AlertService) {
    this.smtpUpdationForm = this.formBuilder.group({
      'host_name': ['', Validators.required],
      'from_name': ['', Validators.required],
      'from_email': ['', Validators.required,],
      'user_name': ['', Validators.required],
      'password': ['', Validators.required],
      'client_id': null
    }); 
    this.getuserSMTPConfigData();
   }
//smtp post data to server
  SmtpPost(body:any ) {
    this.smtpUpdationForm.controls["client_id"].setValue(localStorage.getItem("client_id"));
    
    this.httpService.create(this.smtpUpdationForm.value, "/flujo_client_smtpconfiguration")
    .subscribe(
      data => {
        if(data){
          this.getuserSMTPConfigData();
        this.alertService.success('Social Links  Updated Successfully');
        }else{
          this.alertService.success('No updations found');
        }
      },
      error => {
          console.log(error);
      })
    
  }

  getuserSMTPConfigData() {
    this.httpService.getById(localStorage.getItem("client_id") ,"/flujo_client_smtpconfiguration/")
    .subscribe(
     data => {
       if(data){

        this.smtpItems = data;
       }
       
     },
     error => {
         console.log(error);
     })
    
  }
  deleteSMTP(){
    this.httpService.delete(localStorage.getItem("client_id") ,"/flujo_client_smtpconfiguration/")
    .subscribe(
     data => {
       this.btn_text = "save";
       if(data){
        this.smtpUpdationForm.reset();
        this.alertService.success('Social Links  deleted Successfully');
       }
       console.log(data);
     },
     error => {
         console.log(error);
     })
  }
  setSMTPDataFormDefault(smtpData){
    
    this.smtpUpdationForm.controls['host_name'].setValue(smtpData.host_name);
    this.smtpUpdationForm.controls['from_name'].setValue(smtpData.from_name);
    this.smtpUpdationForm.controls['from_email'].setValue(smtpData.from_email);
    this.smtpUpdationForm.controls['user_name'].setValue(smtpData.user_name);
    this.smtpUpdationForm.controls['password'].setValue(smtpData.password);
    this.smtpUpdationForm.controls['client_id'].setValue(smtpData.client_id);
  }
  EditSMTPLinks(socialData){
    this.isEdit = true;
    this.btn_text = "update";
    this.setSMTPDataFormDefault(socialData);
  }
}