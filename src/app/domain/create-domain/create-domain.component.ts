import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppConstants } from '../../app.constants';
import { Subject } from 'rxjs/Subject';
import { debounceTime, switchMap, distinctUntilChanged, filter, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
// import { empty } from 'rxjs/operators';
import { empty } from 'rxjs/observable/empty';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IDomianCheckResponse } from '../model/Domian.Model';
import { IDomainResponse } from '../../model/email.config.model';
import { MatSelect, MatSelectChange } from '../../../../node_modules/@angular/material';
import { ICommonInterface } from '../../model/commonInterface.model';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AlertService } from 'ngx-alerts';
// import { mergeMap } from '../../../../node_modules/rxjs/operator/mergeMap';


@Component({
  selector: 'app-create-domain',
  templateUrl: './create-domain.component.html',
  styleUrls: ['./create-domain.component.scss']
})
export class CreateDomainComponent implements OnInit {
  inputWatcher: any;
  domainAvalabilityObject: IDomianCheckResponse;
  public suffixes = ['in', 'com', 'net', 'info', 'edu', 'gov'];
  public domain_reg_exp = /^[_A-z0-9.]*((-|)*[_A-z0-9]*)*$/;
  public domain_reg_exp2 = /^[_A-z0-9.]*((-|)*[_A-z0-9.]*)*$/;
  public domainForm: FormGroup;
  public validDomain = false;
  domainResults$ = new Subject<any>();
  public domainDetails: {} | Object;
  domain_name: string;
  matchedDomains: string[];
  confirmed_domain: string;
  constructor(
    private httpClient: HttpClient,
    private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertService,
    public fb: FormBuilder) {
    this.domainForm = fb.group({
      'domain_name': ['', Validators.compose([Validators.pattern(this.domain_reg_exp), Validators.required])],
      'domain_suffix': ['', Validators.required]
    });
  }

  ngOnInit() {
  }
  onSearchChange(searchValue: string) {
    clearTimeout(this.inputWatcher);
    this.inputWatcher = setTimeout(() => {
      if (this.domainForm.controls['domain_name'].valid) {
        const domainSuffixInterval = setInterval(() => {
          if (this.domainForm.controls['domain_suffix'].valid) {
            clearInterval(domainSuffixInterval);
            this.checkDomainAvailability();
            // console.log(this.domainForm.controls['domain_name'].valid);
            // console.log(this.domainForm.controls['domain_suffix'].valid);
          } else {
            // console.log('please select suffix.');
          }
        }, 1000);
      }
      // console.log(this.domainForm.controls['domain_name'].valid);
      // console.log(this.domainForm.controls['domain_suffix'].valid);
    }, 2000);

  }
  // CHECK DOMAIN AVAILABILITY API CALL
  checkDomainAvailability = () => {
    this.spinnerService.show();
    const domain_name = `${this.domainForm.controls['domain_name'].value}.${this.domainForm.controls['domain_suffix'].value}`;
    const postObject = { 'client_id': AppConstants.CLIENT_ID, 'domain_name': domain_name };
    this.httpClient.post<ICommonInterface>(AppConstants.DOMAINS_API_URL + 'domains/checkdomain', postObject)
      .subscribe(
        successResp => {
          if (!successResp.error && successResp.custom_status_code === 100) {
            this.spinnerService.hide();
            this.domainAvalabilityObject = successResp.result[0];
            this.domainAvalabilityObject.domain_name = domain_name;
            // console.log(successResp);
          } else if (successResp.custom_status_code === 160) {
            this.alertService.danger('Internal server Error');
          } else {
            this.spinnerService.hide();
            this.alertService.danger('Something went wrong!');
          }
        },
        errorResp => {
          this.spinnerService.hide();
          // console.log(errorResp);
        });
  }

  // THIS IS USED TO BY THE DOMAIN AFTER DOMAIN CHECK
  buyAvailableDomain = () => {
    this.spinnerService.show();
    const domainCreationDetails = { client_id: AppConstants.CLIENT_ID, domain_name: this.domainAvalabilityObject.domain_name };
    this.httpClient.post<ICommonInterface>(AppConstants.DOMAINS_API_URL + 'domains/checkdomain', domainCreationDetails)
      .subscribe(
        successResp => {
          if (!successResp.error && successResp.custom_status_code === 100) {
            this.spinnerService.hide();
            this.domainAvalabilityObject = successResp.result[0];
            // console.log(successResp);
          } else if (successResp.custom_status_code === 160) {
            this.alertService.danger('Internal server Error');
          } else {
            this.alertService.danger('Something went Wrong!');
            this.spinnerService.hide();
          }
        },
        errorResp => {
          this.spinnerService.hide();
          // console.log(errorResp);
        });
  }
}
