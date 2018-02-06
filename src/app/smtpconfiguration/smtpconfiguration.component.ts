
import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { HttpClient } from '@angular/common/http';
import { ValidationService } from '../service/validation.service';
import { AlertModule, AlertService } from 'ngx-alerts';
import { AppConstants } from '../app.constants';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Component({
  templateUrl: './smtpconfiguration.component.html',
  styleUrls: ['./smtpconfiguration.component.scss']
})
export class SMTPConfigurationComponent { 
  smtpUpdationForm: FormGroup;
  btn_text: string = "save";
  smtpItems: any;
  public isEdit: boolean = false;
  constructor(private spinnerService: Ng4LoadingSpinnerService  , private formBuilder: FormBuilder, private httpClient: HttpClient, private alertService: AlertService) {
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
   ngOnInit() {
    setTimeout(function() {
      this.spinnerService.hide();
    }.bind(this), 3000);
  }
//smtp post data to server
  SmtpPost(body:any ) {
    this.spinnerService.show();
    this.smtpUpdationForm.controls["client_id"].setValue(AppConstants.CLIENT_ID);
    this.httpClient.post(AppConstants.API_URL+"/flujo_client_smtpconfiguration", this.smtpUpdationForm.value)
    .subscribe(
      res => {
        if (res) {
          this.spinnerService.hide();
          this.getuserSMTPConfigData();
          this.alertService.success('SMTP Config Successfully');
        } else {
          this.spinnerService.hide();
          this.alertService.danger('No modifications found');
        }
      },
      err => {
        this.spinnerService.hide();
        this.alertService.danger('Something went wrong.');
      }
    );
  }

  getuserSMTPConfigData() {
    this.spinnerService.show();
    this.httpClient.get(AppConstants.API_URL+"flujo_client_smtpconfiguration/"+AppConstants.CLIENT_ID)
    .subscribe(
      data => {
        data? this.isEdit =false : this.isEdit = true;

        if(data){
          this.spinnerService.hide();
         this.smtpItems = data;
        }else{

          this.spinnerService.hide();
          this.alertService.danger("No data found with this client.");
        }
        
      },
      error => {
        this.spinnerService.hide();
        this.alertService.danger("Something went wrong. please try again.");
          console.log(error);
      });
  }
  deleteSMTP(){
    this.spinnerService.show();
    this.httpClient.delete(AppConstants.API_URL+"flujo_client_smtpconfiguration/"+AppConstants.CLIENT_ID)
    .subscribe(
      data => {
        this.btn_text = "save";
        if(data){
          this.spinnerService.hide();
         this.smtpUpdationForm.reset();
         this.alertService.success('Social Links  deleted Successfully');
        }
        console.log(data);
      },
      error => {
        this.spinnerService.hide();
        this.alertService.danger("Something went wrong. please try again.");
          console.log(error);
      });
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