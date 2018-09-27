import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from '../app.constants';
import { IUserFeatures } from '../model/user-accesslevels.model';
import { ICommonInterface } from '../model/commonInterface.model';
import { Router } from '@angular/router';
import { AlertService } from 'ngx-alerts';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signUpForm: any;
  originURL: string;
  domain: string;
  test: string;
  isSuccess: boolean;
  hideLogin: boolean;
  isOriginExist: boolean;
  ORIGINS: string[] = ['Artrepubliq', 'vinaybhaskar', 'Sarvodaya'];
  originClientName: string;
  originClientDomainName: string;
  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private router: Router,
    private alertService: AlertService
  ) {
    const originAppURL = window.location.href;
    if (originAppURL.includes('https://app.')) {
      const removeApp = originAppURL.split('https://app.');
      const removeCom = removeApp[1].split('.');
      const Clientname = removeApp[1].split('/');
      this.originClientDomainName = Clientname[0];
      this.originClientName = removeCom[0];
      this.isOriginExist = true;
      this.originURL = originAppURL;
    } else if (originAppURL.includes('https://flujo-enterprise-dev.herokuapp.com') &&
                originAppURL.includes('localhost')) {
      this.isOriginExist = false;
    }
    this.signUpForm = formBuilder.group({
      'email': ['', Validators.required],
      'name': [],
      'role': [],
      'access_levels': [],
      'phone': [],
      'origin_url': []
    });
   }

  ngOnInit() {
  }
  setOriginURL = (origin) => {
    this.originClientName = origin;
    if (origin === 'Artrepubliq') {
      this.originURL = 'https://app.artrepubliq.com';
      this.originClientDomainName = 'artrepubliq.com';
    } else if (origin === 'vinaybhaskar') {
      this.originClientDomainName = 'vinaybhaskar.in';
      this.originURL = 'https://app.vinaybhaskar.in';
    } else if (origin === 'Sarvodaya') {
      this.originClientDomainName = 'sarvodaya.ngo';
      this.originURL = 'https://app.sarvodaya.ngo';
    }
  }
  submitSignUpForm = () => {
    this.signUpForm.controls['access_levels'].setValue(this.createUserAccessLevelsObject());
    this.signUpForm.controls['origin_url'].setValue(this.originURL);
    if (this.signUpForm.controls['email'].value === '') {
      this.signUpForm.reset();
      this.alertService.warning('Please Enter Email Id');
    } else {
      this.signUpForm.controls['email'].setValue(this.signUpForm.controls['email'].value + '@' + this.originClientDomainName);
      const formModel = this.signUpForm.value;
      localStorage.setItem('domain_name', this.originClientName);
      this.httpClient.post<ICommonInterface>(AppConstants.API_URL + 'flujo_client_postdomaincreateuser' , formModel)
      .subscribe(
        data => {
          localStorage.removeItem('domain_name');
          if (!data.error && data.custom_status_code === 100) {
            this.signUpForm.reset();
            this.alertService.success('Password Sent to your Email');
            this.router.navigate(['login']);
          } else if (data.error && data.custom_status_code === 101) {
            this.signUpForm.reset();
            this.alertService.warning('Required Parameters are Missing');
          } else if (data.error && data.custom_status_code === 107) {
            this.signUpForm.reset();
            this.alertService.warning('Email Id is not Valid');
          } else if (data.error && data.custom_status_code === 105) {
            this.signUpForm.reset();
            this.alertService.warning('Email Id Already Exists');
          } else {
            this.signUpForm.reset();
            this.alertService.warning('Something Went Wrong');
          }
        }, err => {
          this.signUpForm.reset();
          localStorage.removeItem('domain_name');
          console.log(err);
        }
      );
    }
  }

  createUserAccessLevelsObject = () => {
    const accessLevelsArray = [];
    const accessLevelsObject1 = <IUserFeatures>{};
    accessLevelsObject1.feature_id = '11';
    accessLevelsObject1.sub_feature_ids = ['SF_1', 'SF_2'];
    accessLevelsArray.push(accessLevelsObject1);
    const accessLevelsObject2 = <IUserFeatures>{};
    accessLevelsObject2.feature_id = '10';
    accessLevelsObject2.sub_feature_ids = [];
    accessLevelsArray.push(accessLevelsObject2);
    return accessLevelsArray;
  }
}
