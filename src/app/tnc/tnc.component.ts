import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'ngx-alerts';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { HttpClient } from '@angular/common/http';
import { IHttpResponse } from '../model/httpresponse.model';
import { AppConstants } from '../app.constants';
import { AppComponent } from '../app.component';
import { ITermsData } from '../model/IPrivacyData';
import { AccessDataModelComponent } from '../model/useraccess.data.model';
import { Router } from '@angular/router';
import { ICommonInterface } from '../model/commonInterface.model';
@Component({
  selector: 'app-tnc',
  templateUrl: './tnc.component.html',
  styleUrls: ['./tnc.component.scss']
})
export class TncComponent implements OnInit {

  loading: boolean;
  isAddPage: boolean;
  isTableView: boolean;
  isGridView = true;
  button_text = 'Save';
  isEdit: boolean;
  feature_id = 21;
  termsDetails: ITermsData[];
  tncSubmitForm: FormGroup;
  userAccessDataModel: AccessDataModelComponent;
  constructor(private spinnerService: Ng4LoadingSpinnerService,
    private formBuilder: FormBuilder, private httpClient: HttpClient,
    private alertService: AlertService,
    private router: Router) {
      this.tncSubmitForm = this.formBuilder.group({
        'title' : ['', Validators.required],
        'terms_conditions' : ['', Validators.required],
        'client_id' : [null],
        'termsconditions_id' : [null]
      });
      this.getTermsData();
      if (Number(localStorage.getItem('feature_id')) !== this.feature_id) {
        this.userAccessDataModel = new AccessDataModelComponent(httpClient, router);
        this.userAccessDataModel.setUserAccessLevels(null, this.feature_id, 'admin/termsnconditions');
      }
    }

  ngOnInit() {
    setTimeout(function () {
      this.spinnerService.hide();
  }.bind(this), 3000);
  }
onSubmit = () => {
  this.spinnerService.show();
  this.tncSubmitForm.controls['client_id'].setValue(AppConstants.CLIENT_ID);
  if (this.termsDetails) {
    this.tncSubmitForm.controls['termsconditions_id'].setValue(this.termsDetails[0].id);
  }
  const formModel = this.tncSubmitForm.value;
  this.httpClient.post<ICommonInterface>(AppConstants.API_URL + '/flujo_client_posttermsconditions', formModel)
  .subscribe(
    data => {
      if (data.error) {
          this.alertService.warning('data not submitted');
          // this.parsePostResponse(data);
          this.spinnerService.hide();
      } else {
          this.getTermsData();
          this.parsePostResponse(data);
          this.spinnerService.hide();
      }

  },
     err => {
      console.log(err);
      this.spinnerService.hide();
      this.alertService.danger('Data not Submitted');
    }
  );
}
getTermsData = () => {
  this.httpClient.get<ICommonInterface>(AppConstants.API_URL + '/flujo_client_gettermsconditions/' + AppConstants.CLIENT_ID)
  .subscribe(
    data => {
      if (data.custom_status_code = 200) {
      this.termsDetails = null;
      this.isEdit = false;
      this.termsDetails = data.result;
      console.log(this.termsDetails);
      this.setDefaultClientPrivacyData(this.termsDetails);
      this.spinnerService.hide();
    } else {
      this.alertService.warning('Someting went wrong');
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
      if ((data.custom_status_code = 100) && (data.result[0] === '1')) {
      this.alertService.danger('Deleted Successfully');
      this.spinnerService.hide();
      this.getTermsData();
    } else {
      this.alertService.warning('Someting went wrong');
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
      this.tncSubmitForm.controls['title'].setValue(termsData[0].title);
      this.tncSubmitForm.controls['terms_conditions'].setValue(termsData[0].terms_conditions);
      this.tncSubmitForm.controls['termsconditions_id'].setValue(termsData[0].id);
      console.log(this.tncSubmitForm.value);
  }

}
addPages = () => {
  this.tncSubmitForm.reset();
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
}
