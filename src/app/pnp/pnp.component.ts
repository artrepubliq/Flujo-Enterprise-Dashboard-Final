import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'ngx-alerts';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { HttpClient } from '@angular/common/http';
import { IHttpResponse } from '../model/httpresponse.model';
import { AppConstants } from '../app.constants';
import { AppComponent } from '../app.component';
import { IPrivacyData } from '../model/IPrivacyData';
import { ICommonInterface } from '../model/commonInterface.model';
import { AccessDataModelComponent } from '../model/useraccess.data.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-pnp',
  templateUrl: './pnp.component.html',
  styleUrls: ['./pnp.component.scss']
})
export class PnpComponent implements OnInit {

  isHide = true;
  loading: boolean;
  isAddPage: boolean;
  isTableView: boolean;
  isGridView = true;
  button_text = 'Save';
  isEdit: boolean;
  privacyDetails: IPrivacyData[];
  pnpSubmitForm: FormGroup;
  feature_id = 22;
  userAccessDataModel: AccessDataModelComponent;
  constructor(private spinnerService: Ng4LoadingSpinnerService,
    private formBuilder: FormBuilder, private httpClient: HttpClient,
    private alertService: AlertService, private router: Router) {
    this.pnpSubmitForm = this.formBuilder.group({
      'title': ['', Validators.required],
      'privacy_policy': ['', Validators.required],
      'client_id': [null],
      'privacypolicy_id': [null]
    });
    this.getPrivacyData();
    if (Number(localStorage.getItem('feature_id')) !== this.feature_id) {
      this.userAccessDataModel = new AccessDataModelComponent(httpClient, router);
      this.userAccessDataModel.setUserAccessLevels(null, this.feature_id, 'admin/privacynpolicy');
    }
    this.privacyDetails = [];
  }

  ngOnInit() {
    setTimeout(function () {
      this.spinnerService.hide();
    }.bind(this), 3000);
  }
  onSubmit = () => {
    this.spinnerService.show();
    this.pnpSubmitForm.controls['client_id'].setValue(AppConstants.CLIENT_ID);
    console.log(this.privacyDetails);
    if (this.privacyDetails) {
      this.pnpSubmitForm.controls['privacypolicy_id'].setValue(this.privacyDetails[0].id);
    }
    const formModel = this.pnpSubmitForm.value;
    this.httpClient.post<ICommonInterface>(AppConstants.API_URL + 'flujo_client_postprivacypolicy', formModel)
      .subscribe(
        data => {
          if (AppConstants.ACCESS_TOKEN === data.access_token) {
            if (data.custom_status_code === 100) {
              this.alertService.success('Data submitted successfully');
              this.getPrivacyData();
              this.isGridView = true;
            } else if (data.custom_status_code === 101) {
              this.alertService.warning('Required parameters are missing!');
            } else if (data.custom_status_code === 102) {
              this.alertService.warning('Every thing is upto date!');
            }
          }
          this.parsePostResponse(data);
          this.spinnerService.hide();
        },
        err => {
          console.log(err);
          this.spinnerService.hide();
          this.alertService.danger('Data not Submitted');
        }
      );
  }
  getPrivacyData = () => {
    this.httpClient.get<ICommonInterface>(AppConstants.API_URL + 'flujo_client_getprivacypolicy/' + AppConstants.CLIENT_ID)
      .subscribe(
        data => {
          if (AppConstants.ACCESS_TOKEN === data.access_token) {
            this.privacyDetails = null;
            if (data.custom_status_code === 100 && !data.error) {
              this.privacyDetails = data.result;
              console.log(this.privacyDetails);
              if (this.privacyDetails.length > 0) {
                this.isHide = false;
              } else {
                this.isHide = true;
              }
              this.setDefaultClientPrivacyData(this.privacyDetails);
            } else if (data.custom_status_code === 101) {
              this.alertService.warning('Required parameters are missing!');
            }
          }
          this.isEdit = false;
          this.spinnerService.hide();
        }, error => {
          console.log(error);
          this.loading = false;
          this.spinnerService.hide();
        }
      );
  }
  deleteCompnent = (body) => {
    this.spinnerService.show();
    this.httpClient.delete<ICommonInterface>(AppConstants.API_URL + 'flujo_client_deleteprivacypolicy/' + body)
      .subscribe(
        data => {
          if (AppConstants.ACCESS_TOKEN === data.access_token) {
            if (data.custom_status_code === 100) {
              this.alertService.success('Data deleted successfully');
            } else if (data.custom_status_code === 101) {
              this.alertService.warning('Required parameters are missing!');
            }
          }
          this.spinnerService.hide();
          this.getPrivacyData();
        },
        error => {
          this.spinnerService.hide();
          console.log(error);
        }
      );
  }
  // this method is used to update page detals to the form, if detalis exist
  setDefaultClientPrivacyData = (privacyData) => {
    if (privacyData) {
      this.pnpSubmitForm.controls['title'].setValue(privacyData.title);
      this.pnpSubmitForm.controls['privacy_policy'].setValue(privacyData.privacy_policy);
      this.pnpSubmitForm.controls['privacypolicy_id'].setValue(privacyData.id);
    }

  }
  addPages = () => {
    this.pnpSubmitForm.reset();
    this.isEdit = true;
    this.isAddPage = true;
    this.isTableView = false;
    this.isGridView = false;
    this.button_text = 'Save';
  }
  viewPages = () => {
    this.isEdit = false;
    this.isGridView = false;
    this.isTableView = true;

  }
  viewPagesGrid = () => {
    this.isEdit = false;
    this.isTableView = false;
    this.isGridView = true;
  }
  editCompnent = (privacyItem) => {
    this.isEdit = true;
    this.isTableView = false;
    this.isGridView = false;
    this.button_text = 'Update';
    this.setDefaultClientPrivacyData(privacyItem);
  }
  parsePostResponse(response) {
    this.loading = false;
    this.pnpSubmitForm.reset();
    this.isEdit = false;
    this.isGridView = true;
    this.button_text = 'Save';
    this.getPrivacyData();
  }
  cancelFileEdit() {
    this.isEdit = false;
    this.isGridView = true;
    this.getPrivacyData();
  }
}
