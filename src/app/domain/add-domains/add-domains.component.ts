import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppConstants } from '../../app.constants';
import { HttpClient } from '../../../../node_modules/@angular/common/http';
import { ICommonInterface } from '../../model/commonInterface.model';
import { IAddedDomainResponse } from '../model/Domian.Model';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AlertService } from '../../../../node_modules/ngx-alerts';

@Component({
  selector: 'app-add-domains',
  templateUrl: './add-domains.component.html',
  styleUrls: ['./add-domains.component.scss']
})
export class AddDomainsComponent implements OnInit {
  public domain_details_form: FormGroup;
  public addedDomain: IAddedDomainResponse[];
  // public domain_reg_exp = /^[_A-z0-9.]*((-|)*[_A-z0-9]*)*$/;
  // public domain_reg_exp = /^[_A-z0-9.]*((-|)*[_A-z0-9.]*)*$/;
  public domain_reg_exp = /(?:www\.)?(\w+)\.[A-z0-9]/;
  constructor(
    private httpClient: HttpClient,
    private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertService,
    public fb: FormBuilder) {
    this.domain_details_form = this.fb.group({
      'domain_name': ['', Validators.compose([Validators.pattern(this.domain_reg_exp), Validators.required])],
      'client_id': [AppConstants.CLIENT_ID]
    });
  }

  ngOnInit() {
  }

  public onSubmit = (): void => {
    // const postObject = { 'client_id': AppConstants.CLIENT_ID, 'domain_name': domain_name };
    this.spinnerService.show();
    this.httpClient.post<ICommonInterface>(AppConstants.DOMAINS_API_URL + 'domains/checkdomain', this.domain_details_form.value)
      .subscribe(
        result => {
          console.log(result);
          if (!result.error && !result.result[0].available) {
            this.httpClient.post<ICommonInterface>(AppConstants.DOMAINS_API_URL + 'domains/adddomain', this.domain_details_form.value)
              .subscribe(
                res => {
                  this.addedDomain = res.result;
                  this.spinnerService.hide();
                  this.domain_details_form.controls['domain_name'].setValue('');
                  console.log(res);
                  if (!res.error && res.custom_status_code === 100) {
                    this.alertService.info('Domain added sucessfully');
                  } else if (res.custom_status_code === 160) {
                    this.alertService.danger('Internal server Error');
                  } else {
                    this.alertService.warning('Something went wrong');
                  }
                },
                err => {
                  console.log(err);
                });
          } else if (result.custom_status_code === 150) {
            this.spinnerService.hide();
            this.alertService.warning('Sorry You dont have proper access!!');
          } else if (result.custom_status_code === 101) {
            this.spinnerService.hide();
            this.alertService.danger('Requiered parameters are missing!');
          } else if (result.custom_status_code === 160) {
            this.spinnerService.hide();
            this.alertService.danger('Internal server occured');
          } else {
            this.spinnerService.hide();
            this.alertService.warning('Please enter existing domain!!');
          }
          console.log(result);
        },
        error => {
          console.log(error);
        });

    // console.log(this.domain_details_form.value);
  }
}
