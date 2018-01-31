import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpService } from '../service/httpClient.service';
import { ValidationService } from '../service/validation.service';
import { AlertModule, AlertService } from 'ngx-alerts';

import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

import { ISocialLinks } from "../model/sociallinks.model";
import { HttpClient } from "@angular/common/http";
import * as _ from 'underscore';


@Component({
  templateUrl: './sociallinks.component.html',
  styleUrls: ['./sociallinks.component.scss']
})
export class SocialLinksComponent {
  SocialData: ISocialLinks;
  socialItems: any;
  socialLinksForm: FormGroup;
  form_btntext: string = "save";
  public isEdit: boolean = false;

  constructor(private spinnerService: Ng4LoadingSpinnerService,private formBuilder: FormBuilder, private httpClient: HttpClient, private httpService: HttpService, private alertService: AlertService) {


    this.socialLinksForm = this.formBuilder.group({
      'socialitem_name': ['', [Validators.required]],
      'socilaitem_url': ['', [Validators.required, ValidationService.domainValidator]],
      'socialitem_id': null
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

    if(this.form_btntext == "Update"){
      this.socialLinksForm.controls['socialitem_id'].setValue(localStorage.getItem("socilaitem_id"));
    }
    

    this.httpService.create(this.socialLinksForm.value, "/flujo_client_sociallinks")
      .subscribe(
      data => {

        if (data) {

          // this.socialLinksForm.reset();
          this.getSocialLinksData();
          this.alertService.success('Social Links  Updated Successfully');
          this.spinnerService.hide();
        }else if(data){ 
        this.alertService.success('No modifications found');

          this.alertService.success('Social Links  Updated Successfully');
          this.getSocialLinksData();
        } else {
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

    this.isEdit = false;
    this.httpClient
      .get<ISocialLinks>('http://flujo.in/dashboard/flujo.in_api_client/flujo_client_sociallinks/1232')
      .subscribe(
      // Successful responses call the first callback.
      data => {
        this.socialItems = data;
        if (this.socialItems.id) {
          this.isEdit = false;
          
        } else {
          this.isEdit = true;
        }


      },

      err => {
        console.log(err);
      }
      );

  }
//function to view the social items
viewSocialLinks(){
  this.isEdit = false;
}
  //sociallinks delete from db

  socialLinksFormDelete(body: any) {
    this.spinnerService.show();
  }
  deleteSocialLinks(socialItem) {

    if (localStorage.getItem("client_id")) {
      this.httpClient.delete("http://flujo.in/dashboard/flujo.in_api_client/flujo_client_sociallinks/"+socialItem.id)
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
    this.socialLinksForm.controls['socialitem_name'].setValue(formdata.socialitem_name);
    this.socialLinksForm.controls['socilaitem_url'].setValue(formdata.socialitem_url);

  }
  setSocialFormToDefault() {
    this.form_btntext = "save";
    this.socialLinksForm.controls['socialitem_name'].setValue("");
    this.socialLinksForm.controls['socilaitem_url'].setValue("");
    // this.socialLinksForm.controls['wikipedia'].setValue("");
    // this.socialLinksForm.controls['youtube'].setValue("");
    this.socialLinksForm.controls['client_id'].setValue("");

  }
  EditSocialLinks(socialData) {
    this.isEdit = true;
    localStorage.setItem("socilaitem_id",socialData.id);
    console.log(localStorage.getItem("socilaitem_id"));
    this.form_btntext = socialData.id ? "Update" : "Save";
    this.setDataToForm(socialData);
  }

  
}