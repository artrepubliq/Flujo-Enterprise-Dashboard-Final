import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'ngx-alerts';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { HttpClient } from '@angular/common/http';
import { IHttpResponse } from '../model/httpresponse.model';
import { AppConstants } from '../app.constants';
import { AppComponent } from '../app.component';
import { ITermsData } from '../model/IPrivacyData';
import { Router } from '@angular/router';
import { ICommonInterface } from '../model/commonInterface.model';
@Component({
  selector: 'app-tnc',
  templateUrl: './tnc.component.html',
  styleUrls: ['./tnc.component.scss']
})
export class TncComponent implements OnInit {

  isButton = false;
  loading: boolean;
  isAddPage: boolean;
  isTableView: boolean;
  isGridView = true;
  button_text = 'Save';
  isEdit: boolean;
  termsDetails: ITermsData[];
  tncSubmitForm: FormGroup;
  termsContent: any;
  editedData: any;
  constructor(private spinnerService: Ng4LoadingSpinnerService,
    private formBuilder: FormBuilder, private httpClient: HttpClient,
    private alertService: AlertService,
    private router: Router) {
    this.tncSubmitForm = this.formBuilder.group({
      'title': ['', Validators.required],
      'terms_conditions': ['', Validators.required],
      'client_id': [null],
      'termsconditions_id': [null]
    });
    this.getTermsData();
  }

  ngOnInit() {
    setTimeout(function () {
      this.spinnerService.hide();
    }.bind(this), 3000);
  }
  onSubmit = () => {
    this.spinnerService.show();
    this.tncSubmitForm.controls['client_id'].setValue(AppConstants.CLIENT_ID);
    this.tncSubmitForm.controls['terms_conditions'].setValue(this.editedData);
    if (this.termsDetails.length > 0) {
      this.tncSubmitForm.controls['termsconditions_id'].setValue(this.termsDetails[0].id);
    }
    const formModel = this.tncSubmitForm.value;
    this.httpClient.post<ICommonInterface>(AppConstants.API_URL + 'flujo_client_posttermsconditions', formModel)
      .subscribe(
        data => {
          if (!data.error && data.custom_status_code === 100) {
            this.alertService.success('Data updated successfully');
            this.getTermsData();
            this.isGridView = true;
            this.spinnerService.hide();
          } else if (data.custom_status_code === 101) {
            this.alertService.warning('Required parameters are missing!');
            this.spinnerService.hide();
          } else if (data.custom_status_code === 102) {
            this.alertService.warning('Every thing is upto date!');
            this.spinnerService.hide();
          }
        },
        err => {
          console.log(err);
          this.spinnerService.hide();
          this.alertService.danger('Data not Submitted');
          this.getTermsData();
        }
      );
  }
  getTermsData = () => {
    this.httpClient.get<ICommonInterface>(AppConstants.API_URL + 'flujo_client_gettermsconditions/' + AppConstants.CLIENT_ID)
      .subscribe(
        data => {
          if (data.custom_status_code === 100) {
            this.termsDetails = null;
            this.isEdit = false;
            this.termsDetails = data.result;
            if (this.termsDetails.length === 0) {
              this.isButton = true;
            } else {
              this.isButton = false;
            }
            console.log(this.termsDetails);
            this.setDefaultClientPrivacyData(this.termsDetails);
            this.spinnerService.hide();
          } else if ((data.error) && (data.custom_status_code = 102)) {
            this.alertService.warning('Everything is upto date');
          } else if ((data.error) && (data.custom_status_code = 101)) {
            this.alertService.warning('Required parameters are missing');
          }
        }, error => {
          console.log(error);
          this.loading = false;
          this.spinnerService.hide();
        }
      );
  }
  deleteCompnent = (body) => {
    this.spinnerService.show();
    this.httpClient.delete<ICommonInterface>(AppConstants.API_URL + 'flujo_client_deletetermsconditions/' + body.id)
      .subscribe(
        data => {
          if (data.custom_status_code === 100) {
            this.alertService.success('Data deleted successfully');
            this.spinnerService.hide();
            this.getTermsData();
          } else if (data.custom_status_code === 101) {
            this.alertService.warning('Required parameters are missing!');
            this.spinnerService.hide();
          }
        },
        error => {
          this.spinnerService.hide();
          console.log(error);
        }
      );
  }
  // this method is used to update page detals to the form, if detalis exist
  setDefaultClientPrivacyData = (termsData) => {
    console.log(termsData);
    if (termsData) {
      this.termsContent = termsData.terms_conditions;
      this.tncSubmitForm.controls['title'].setValue(termsData.title);
      this.tncSubmitForm.controls['terms_conditions'].setValue(termsData.terms_conditions);
      this.tncSubmitForm.controls['termsconditions_id'].setValue(termsData.id);
      console.log(this.tncSubmitForm.value);
    }

  }
  addPages = () => {
    this.isEdit = true;
    this.isAddPage = true;
    this.isTableView = false;
    this.isGridView = false;
    this.button_text = 'Save';
  }
  viewPages = () => {
    // this.getModuleDetails();
    this.isEdit = false;
    this.isGridView = false;
    this.isTableView = true;

  }
  viewPagesGrid = () => {
    this.isEdit = false;
    this.isTableView = false;
    this.isGridView = true;
  }
  editCompnent = (termsItem) => {
    // this.alertService.success('page updated successfull.');
    this.isEdit = true;
    this.isTableView = false;
    this.isGridView = false;
    this.button_text = 'Update';
    this.setDefaultClientPrivacyData(termsItem);
  }
  parsePostResponse(response) {
    this.alertService.success('Request Completed Successfully.');
    this.loading = false;
    this.tncSubmitForm.reset();
    this.isEdit = false;
    this.isGridView = true;
    this.button_text = 'Save';
    this.getTermsData();
  }
  cancelFileEdit() {
    this.isEdit = false;
    this.isGridView = true;
    this.getTermsData();
  }
  editedTermsData = (event) => {
    console.log(event);
    this.editedData = event;
  }
}
