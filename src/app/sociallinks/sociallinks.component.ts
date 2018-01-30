import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpService } from '../service/httpClient.service';
import { ValidationService } from '../service/validation.service';
import { AlertModule, AlertService } from 'ngx-alerts';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Component({
  templateUrl: './sociallinks.component.html',
  styleUrls: ['./sociallinks.component.scss']
})
export class SocialLinksComponent {
  socialItems: any;
  socialLinksForm: FormGroup;
  form_btntext: string = "save";
  public isEdit: boolean = false;
  constructor(private spinnerService: Ng4LoadingSpinnerService,private formBuilder: FormBuilder, private httpService: HttpService, private alertService: AlertService) {
    this.socialLinksForm = this.formBuilder.group({
      'facebook': ['', [Validators.required, ValidationService.domainValidator]],
      'twitter': ['', [Validators.required, ValidationService.domainValidator]],
      'wikipedia': ['', [Validators.required, ValidationService.domainValidator]],
      'youtube': ['', [Validators.required, ValidationService.domainValidator]],
      'client_id': null
    });

    this.getSocialLinksData();
  }
  ngOnInit() {
    setTimeout(function() {
        this.spinnerService.hide();
      }.bind(this), 3000);
  }
  socialLinksFormSubmit(body: any) {
    this.spinnerService.show();
    console.log(this.socialLinksForm.value);
    this.socialLinksForm.controls['client_id'].setValue(localStorage.getItem("client_id"));
    this.httpService.create(this.socialLinksForm.value, "/flujo_client_sociallinks")
      .subscribe(
      data => {

        if (data) {
          // this.socialLinksForm.reset();
          this.getSocialLinksData();
          this.alertService.success('Social Links  Updated Successfully');
          this.spinnerService.hide();
        }else{
        this.alertService.success('No modifications found');
        }
      },
      error => {
        console.log(error);
        this.spinnerService.hide();
      })
  }

  //get sociallinks data from db
  getSocialLinksData() {
    this.spinnerService.show();
    if (localStorage.getItem("client_id")) {
      this.httpService.getById(localStorage.getItem("client_id"), "/flujo_client_sociallinks/")
        .subscribe(
        data => {
          if (data) {
            this.isEdit = false;
            this.socialItems = data;
            this.spinnerService.hide();
          }else{
            this.isEdit = true;
          }
          
        },
        error => {
          console.log(error);
          this.spinnerService.hide();
        })
    }

  }

  //sociallinks delete from db
  socialLinksFormDelete(body: any) {
    this.spinnerService.show();
    if (localStorage.getItem("client_id")) {
      this.httpService.delete(localStorage.getItem("client_id"), "/flujo_client_sociallinks/")
        .subscribe(
        data => {
          if (data) {
            this.setSocialFormToDefault();
            this.alertService.success('Social Links deleted Successfully');
            this.spinnerService.hide();
          }
        },
        error => {
          console.log(error);
          this.spinnerService.hide();
        })
    }
  }

  setDataToForm(formdata) {
    this.socialLinksForm.controls['facebook'].setValue(formdata.facebook);
    this.socialLinksForm.controls['twitter'].setValue(formdata.twitter);
    this.socialLinksForm.controls['wikipedia'].setValue(formdata.wikipedia);
    this.socialLinksForm.controls['youtube'].setValue(formdata.youtube);

  }
  setSocialFormToDefault() {
    this.form_btntext = "save";
    this.socialLinksForm.controls['facebook'].setValue("");
    this.socialLinksForm.controls['twitter'].setValue("");
    this.socialLinksForm.controls['wikipedia'].setValue("");
    this.socialLinksForm.controls['youtube'].setValue("");
    this.socialLinksForm.controls['client_id'].setValue("");

  }
  EditSocialLinks(socialData){
    this.isEdit = true;
    this.form_btntext = "update";
    this.setDataToForm(socialData);
  }
}