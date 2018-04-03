import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'ngx-alerts';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { HttpClient } from '@angular/common/http';
import { IHttpResponse } from '../model/httpresponse.model';
import { AppConstants } from '../app.constants';
@Component({
  selector: 'app-tnc',
  templateUrl: './tnc.component.html',
  styleUrls: ['./tnc.component.scss']
})
export class TncComponent implements OnInit {

  tncSubmitForm: FormGroup;
  constructor(private spinnerService: Ng4LoadingSpinnerService, private formBuilder: FormBuilder, private httpClient: HttpClient,
    private alertService: AlertService) {
      this.tncSubmitForm = this.formBuilder.group({
        'title': ['', Validators.required],
        'terms_conditions': ['', Validators.required],
        'client_id': [null]
      });
  }

  ngOnInit() {
  }
onSubmit = () => {
  this.spinnerService.show();
  this.tncSubmitForm.controls['client_id'].setValue(AppConstants.CLIENT_ID);
  const formModel = this.tncSubmitForm.value;
  this.httpClient.post<IHttpResponse>(AppConstants.API_URL + '/flujo_client_posttermsconditions', formModel)
  .subscribe(
    data => {
      this.spinnerService.hide();
      this.alertService.success('Data Submitted Successfully');
    }, err => {
      console.log(err);
      this.spinnerService.hide();
      this.alertService.danger('Data not Submitted');
    }
  );
}
}
