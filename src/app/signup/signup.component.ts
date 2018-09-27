import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from '../app.constants';
import { IUserFeatures } from '../model/user-accesslevels.model';
import { ICommonInterface } from '../model/commonInterface.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signUpForm: any;
  dummy: string[];
  dummy1: string[];
  domain: string;
  test: string;
  httpOptions: { headers: HttpHeaders; };
  alertService: any;
  isSuccess: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private router: Router
  ) {
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
    // this.test = 'https://app.artrepubliq.com/';
    this.test = window.location.href;
    this.dummy = this.test.split('https://app.');
    this.dummy1 = this.dummy[1].split('/');
    this.domain = this.dummy1[0];
    const accept = this.domain.split('.');
    console.log(accept[0], '39');
    this.httpOptions = {
      headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': accept[0]
      })
    };
  }
  submitSignUpForm = () => {
    this.signUpForm.controls['access_levels'].setValue(this.createUserAccessLevelsObject());
    this.signUpForm.controls['origin_url'].setValue(this.test);
    this.signUpForm.controls['email'].setValue(this.signUpForm.controls['email'].value + '@' + this.domain);
    const formModel = this.signUpForm.value;
    this.httpClient.post<ICommonInterface>(AppConstants.API_URL + 'flujo_client_postdomaincreateuser' , formModel, this.httpOptions)
    .subscribe(
      data => {
        if (!data.error && data.custom_status_code === 100) {
          this.signUpForm.reset();
          this.alertService.success('Successfully Signed Up');
          this.isSuccess = true;
          this.router.navigate(['login']);
        } else if (data.error && data.custom_status_code === 101) {
          this.signUpForm.reset();
          this.alertService.warning('Required Parameters are Missing');
        } else if (data.error && data.custom_status_code === 107) {
          this.signUpForm.reset();
          this.alertService.warning('Email Id is not Valid');
        } else {
          this.signUpForm.reset();
          this.alertService.warning('Something Went Wrong');
        }
      }, err => {
        this.signUpForm.reset();
        console.log(err);
      }
    );
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
