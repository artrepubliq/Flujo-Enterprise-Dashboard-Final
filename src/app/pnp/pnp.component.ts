import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'ngx-alerts';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { HttpClient } from '@angular/common/http';
import { IHttpResponse } from '../model/httpresponse.model';
import { AppConstants } from '../app.constants';
import { AppComponent } from '../app.component';
import { IPrivacyData } from '../model/IPrivacyData';
@Component({
  selector: 'app-pnp',
  templateUrl: './pnp.component.html',
  styleUrls: ['./pnp.component.scss']
})
export class PnpComponent implements OnInit {

  loading: boolean;
  isAddPage: boolean;
  isTableView: boolean;
  isGridView = true;
  button_text = 'Save';
  isEdit: boolean;
  privacyDetails: IPrivacyData;
  pnpSubmitForm: FormGroup;
  constructor(private spinnerService: Ng4LoadingSpinnerService, private formBuilder: FormBuilder, private httpClient: HttpClient,
    private alertService: AlertService) {
      this.pnpSubmitForm = this.formBuilder.group({
        'title' : ['', Validators.required],
        'privacy_policy' : ['', Validators.required],
        'client_id' : [null],
        'privacypolicy_id' : [null]
      });
      this.getPrivacyData();
    }

  ngOnInit() {
  }
onSubmit = () => {
  this.spinnerService.show();
  this.pnpSubmitForm.controls['client_id'].setValue(AppConstants.CLIENT_ID);
  this.pnpSubmitForm.controls['privacypolicy_id'].setValue(this.privacyDetails[0].id);
  const formModel = this.pnpSubmitForm.value;
  this.httpClient.post<IHttpResponse>(AppConstants.API_URL + '/flujo_client_postprivacypolicy', formModel)
  .subscribe(
    data => {
      if (data.error) {
          this.alertService.warning(data.result);
          // this.parsePostResponse(data);
          this.spinnerService.hide();
      } else {
          this.getPrivacyData();
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
getPrivacyData = () => {
  this.httpClient.get<IPrivacyData>(AppConstants.API_URL + '/flujo_client_getprivacypolicy/' + AppConstants.CLIENT_ID)
  .subscribe(
    data => {
      this.privacyDetails = null;
      this.isEdit = false;
      this.privacyDetails = data;
      this.setDefaultClientPrivacyData(this.privacyDetails);
      this.spinnerService.hide();
    }, error => {
      console.log(error);
      this.loading = false;
      this.spinnerService.hide();
    }
  );
}
// this method is used to update page detals to the form, if detalis exist
setDefaultClientPrivacyData = (privacyData) => {
  console.log(privacyData);
  if (privacyData) {
      this.pnpSubmitForm.controls['title'].setValue(privacyData[0].title);
      this.pnpSubmitForm.controls['privacy_policy'].setValue(privacyData[0].privacy_policy);
      this.pnpSubmitForm.controls['privacypolicy_id'].setValue(privacyData[0].id);
      console.log(this.pnpSubmitForm.value);
  }

}
addPages = () => {
  this.pnpSubmitForm.reset();
  this.isEdit = true;
  this.isAddPage = true;
  this.isTableView = false;
  this.isGridView = false;
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
editCompnent = (privacyItem) => {
 // this.alertService.success('page updated successfull.');
  this.isEdit = true;
  this.isTableView = false;
  this.isGridView = false;
  this.button_text = 'Update';
  this.setDefaultClientPrivacyData(privacyItem);
}
parsePostResponse(response) {
  this.alertService.success('request completed successfully.');
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
}
}
