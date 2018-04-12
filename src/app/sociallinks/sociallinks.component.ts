import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../service/validation.service';
import { AlertModule, AlertService } from 'ngx-alerts';

import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

import { ISocialLinks } from '../model/sociallinks.model';
import { HttpClient } from '@angular/common/http';
import * as _ from 'underscore';
import { AppConstants } from '../app.constants';
import { IHttpResponse } from '../model/httpresponse.model';
import { Router } from '@angular/router';
import { AdminComponent } from '../admin/admin.component';
import { CommonInterface } from '../model/analytics.model';

@Component({
  templateUrl: './sociallinks.component.html',
  styleUrls: ['./sociallinks.component.scss']
})
export class SocialLinksComponent implements OnInit {
  addNew: boolean;
  filteredUserAccessData: any;
  userAccessLevelObject: any;
  socialItemId: any;
  SocialData: ISocialLinks;
  socialItems: any;
  socialLinksForm: FormGroup;
  form_btntext = 'save';
  successMessage: string;
  deleteMessage: string;

  constructor(private spinnerService: Ng4LoadingSpinnerService, private formBuilder: FormBuilder, private httpClient: HttpClient,
    private alertService: AlertService, private router: Router, public adminComponent: AdminComponent) {

    this.socialLinksForm = this.formBuilder.group({
      'socialitem_name': ['', [Validators.required]],
      'socialitem_url': ['', [Validators.required]],
      'socialitem_id': null,
      client_id: AppConstants.CLIENT_ID
    });

    this.getSocialLinksData();
    if (this.adminComponent.userAccessLevelData) {
      this.userRestrict();
    } else {
      this.adminComponent.getUserAccessLevelsHttpClient()
        .subscribe(
          resp => {
            this.spinnerService.hide();
            _.each(resp, item => {
              if (item.user_id === localStorage.getItem('user_id')) {
                this.userAccessLevelObject = item.access_levels;
              } else {
                // this.userAccessLevelObject = null;
              }
            });
            this.adminComponent.userAccessLevelData = JSON.parse(this.userAccessLevelObject);
            this.userRestrict();
          },
          error => {
            console.log(error);
            this.spinnerService.hide();
          }
        );
    }
  }
  ngOnInit() {
    setTimeout(function () {
      this.spinnerService.hide();
    }.bind(this), 3000);
  }
  // this for restrict user on root access level
  userRestrict() {
    _.each(this.adminComponent.userAccessLevelData, (item, iterate) => {
      // tslint:disable-next-line:max-line-length
      if (this.adminComponent.userAccessLevelData[iterate].name === 'Social links update' && this.adminComponent.userAccessLevelData[iterate].enable) {
        this.filteredUserAccessData = item;
      } else {
        // this.router.navigate(['/accessdenied']);
        // console.log('else');
      }
    });
    if (this.filteredUserAccessData) {
      this.router.navigate(['admin/sociallinks']);
    } else {
      this.router.navigate(['/accessdenied']);
      console.log('else');
    }
  }
  socialLinksFormSubmit(body: any) {
    this.spinnerService.show();

    this.httpClient.post<IHttpResponse>(AppConstants.API_URL + '/flujo_client_postsociallinks', body)


      .subscribe(
        res => {
          if (res.error) {
            this.spinnerService.hide();
            this.alertService.warning(res.result);
          } else {
            this.spinnerService.hide();
            this.getSocialLinksData();
            this.socialLinksForm.reset();
            this.alertService.success('Social Links  request completed Successfully');
          }
        },
        err => {
          this.spinnerService.hide();
          this.alertService.danger('Something went wrong.');
        }
      );
  }

  // get sociallinks data from db
  getSocialLinksData() {

    this.spinnerService.show();
    this.httpClient
      .get<CommonInterface>(AppConstants.API_URL + 'flujo_client_getsociallinks/' + AppConstants.CLIENT_ID)
      .subscribe(
        data => {
          this.spinnerService.hide();
          this.socialItems = data.result;
          this.socialItems.map(object => {
            object.editLink = false;
            // delete Employee.firstname;
            object.socialitem_id = object.id;
            delete object.id;
          });
          console.log(this.socialItems);
          this.addNew = false;
        },

        err => {
          this.spinnerService.hide();
          console.log(err);
        }
      );

  }

  // add new item
  addNewItem() {
    this.addNew = true;
    this.setSocialFormToDefault();
  }
  cancelNew() {
    this.addNew = false;
  }
  // sociallinks delete from db
  deleteSocialLinks(socialItem) {
    console.log(socialItem);
    this.spinnerService.show();
    this.httpClient.delete(AppConstants.API_URL + 'flujo_client_deletesociallinks/' + socialItem.socialitem_id)
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
          this.alertService.danger('Social item is not deleted.');
          this.spinnerService.hide();
        });
  }
  setDataToForm(formdata) {
    this.socialLinksForm.controls['socialitem_name'].setValue(formdata.socialitem_name);
    this.socialLinksForm.controls['socialitem_url'].setValue(formdata.socialitem_url);

  }
  setSocialFormToDefault() {
    this.form_btntext = 'save';
    this.socialLinksForm.controls['socialitem_name'].setValue('');
    this.socialLinksForm.controls['socialitem_url'].setValue('');
    this.socialLinksForm.controls['socialitem_id'].setValue('');

  }
  EditSocialLinks(socialData) {
    console.log(socialData);
    socialData.editLink = true;
    this.socialItemId = socialData.id;
    this.addNew = false;
    // localStorage.setItem('socialitem_id', socialData.id);
    // console.log(localStorage.getItem('socialitem_id'));
    // this.form_btntext = socialData.id ? 'Update' : 'Save';
    // this.setDataToForm(socialData);
  }

  cancelEdit(socialData) {
    socialData.editLink = false;
  }

  updateLink(socialData) {
    console.log(socialData);
  }
  modifyLink(event, socialData) {
    socialData.socialitem_url = event.target.value;
    console.log(event.target.value);
  }
}
