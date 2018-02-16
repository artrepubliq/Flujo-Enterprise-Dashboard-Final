import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ValidationService } from '../service/validation.service';
import { AlertModule, AlertService } from 'ngx-alerts';

import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

import { ISocialLinks } from "../model/sociallinks.model";
import { HttpClient } from "@angular/common/http";
import * as _ from 'underscore'
import { AppConstants } from '../app.constants';
import { IHttpResponse } from "../model/httpresponse.model";

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

  constructor(private spinnerService: Ng4LoadingSpinnerService, private formBuilder: FormBuilder, private httpClient: HttpClient, private alertService: AlertService) {

    this.socialLinksForm = this.formBuilder.group({
      'socialitem_name': ['', [Validators.required]],
      'socialitem_url': ['', [Validators.required, ValidationService.domainValidator]],
      'socialitem_id': null,
      client_id: AppConstants.CLIENT_ID
    });

    this.getSocialLinksData();
  }
  ngOnInit() {
    setTimeout(function () {
      this.spinnerService.hide();
    }.bind(this), 3000);
  }
  socialLinksFormSubmit(body: any) {
    this.spinnerService.show();
    if (this.form_btntext == "Update") {
      this.socialLinksForm.controls['socialitem_id'].setValue(localStorage.getItem("socilaitem_id"));
    } else {
      this.socialLinksForm.controls['socialitem_id'].setValue("null");
    }


    this.httpClient.post<IHttpResponse>(AppConstants.API_URL+"/flujo_client_postsociallinks", this.socialLinksForm.value)


      .subscribe(
        res => {
          if (res.error) {
            this.spinnerService.hide();
            this.alertService.warning(res.result);
          } else {
            this.spinnerService.hide();
            this.getSocialLinksData();
            this.alertService.success('Social Links  request completed Successfully');
            
          }
        },
        err => {
          this.spinnerService.hide();
          this.alertService.danger('Something went wrong.');
        }
      );
  }

  //get sociallinks data from db
  getSocialLinksData() {

    this.spinnerService.show();
    this.isEdit = false;
    this.httpClient
      .get<ISocialLinks>(AppConstants.API_URL+'flujo_client_getsociallinks/'+AppConstants.CLIENT_ID)
      .subscribe(
      data => {
        this.spinnerService.hide();
        this.socialItems = data;
        if (this.socialItems[0].id) {
          this.isEdit = false;

        } else {
          this.isEdit = true;
        }
      },

      err => {
        this.spinnerService.hide();
        console.log(err);
      }
      );

  }
  //function to view the social items
  viewSocialLinks() {
    this.isEdit = false;
  }
  //add new item
  addNewItem(){
    this.isEdit = true;
    this.setSocialFormToDefault();
  }
  //sociallinks delete from db
  deleteSocialLinks(socialItem) {
    this.spinnerService.show();
    
      this.httpClient.delete(AppConstants.API_URL+"flujo_client_deletesociallinks/" + socialItem.id)
        .subscribe(
          data => {
          if (data) {
            this.getSocialLinksData();
            this.alertService.success('Social Links deleted Successfully');
            this.spinnerService.hide();
          }
        },
        error => {
          console.log(error);
          this.alertService.danger("Social item is not deleted.");
          this.spinnerService.hide();
        })
    
  }
  setDataToForm(formdata) {
    this.socialLinksForm.controls['socialitem_name'].setValue(formdata.socialitem_name);
    this.socialLinksForm.controls['socialitem_url'].setValue(formdata.socialitem_url);

  }
  setSocialFormToDefault() {
    this.form_btntext = "save";
    this.socialLinksForm.controls['socialitem_name'].setValue("");
    this.socialLinksForm.controls['socialitem_url'].setValue("");
    this.socialLinksForm.controls['socialitem_id'].setValue("");

  }
  EditSocialLinks(socialData) {
    this.isEdit = true;
    localStorage.setItem("socialitem_id", socialData.id);
    console.log(localStorage.getItem("socialitem_id"));
    this.form_btntext = socialData.id ? "Update" : "Save";
    this.setDataToForm(socialData);
  }
}