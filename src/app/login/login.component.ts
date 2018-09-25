
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { HttpService } from '../service/httpClient.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from '../app.constants';
import { AlertModule, AlertService } from 'ngx-alerts';
// We haven't defined these services yet
// import { AuthService } from '../auth.service';
// import { AuthService } from '../auth/auth.service';
import { LoginAuthService } from '../auth/login.auth.service';
import { Router } from '@angular/router';
import { Keepalive } from '@ng-idle/keepalive';
import { IcustomLoginModelDetails, IPostChatCampModel } from '../model/custom.login.model';
import { error } from 'util';
import { IHttpResponse } from '../model/httpresponse.model';
import { Location } from '@angular/common';
import { ICommonInterface } from '../model/commonInterface.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  originClientName: any;
  hideLogin: boolean;
  loginData: IcustomLoginModelDetails[];
  chatCampUrlData: any;
  public isLoggedIn = true;
  EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
  loginForm: FormGroup;
  passwordForm: FormGroup;
  clientLogo: any;
  client_id: any;
  originURL = '';
  isOriginExist: boolean;
  ORIGINS: string[] = ['Artrepubliq', 'vinaybhaskar', 'Sarvodaya'];
  // private _headers = new HttpHeaders();
  constructor(private router: Router, private alertService: AlertService,
    private formBuilder: FormBuilder, private spinnerService: Ng4LoadingSpinnerService,
    private httpClient: HttpClient, private loginAuthService: LoginAuthService,
    public location: Location) {
      const originAppURL = window.location.href;
      if (originAppURL.includes('app')) {
        this.isOriginExist = true;
        this.originURL = originAppURL;
        this.originClientName = originAppURL;
        this.getLogoDetails();
      } else if (originAppURL.includes('https://flujo-enterprise-dev.herokuapp.com')) {
        this.isOriginExist = false;
      } else {
        window.open('', '_self', ''); window.close();
      }
    this.loginForm = this.formBuilder.group({
      // 'user_name': ['', Validators.required],
      'email': ['', Validators.compose([Validators.required, Validators.pattern(this.EMAIL_REGEXP)])],
      'password': ['', Validators.required],
      'origin_url': [null]
    });
    this.passwordForm = this.formBuilder.group({
      // 'user_name': ['', Validators.required],
      'email_id': ['', Validators.compose([Validators.required, Validators.pattern(this.EMAIL_REGEXP)])],
      'client_id': [null]
    });
    if (this.loginAuthService.authenticated) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/login']);
    }
  }
  // When this component is loaded, we'll call the dealService and get our public deals.
  ngOnInit() {
    this.hideLogin = false;
    localStorage.setItem('isLoginPageLoads', 'true');
    // this.getLogoDetails();
    // this.loginData['logo_name'] = '';
  }

  setOriginURL = (origin) => {
    this.originClientName = origin;
    if (origin === 'Artrepubliq') {
      this.originURL = 'https://app.artrepubliq.com';
    } else if (origin === 'vinaybhaskar') {
      this.originURL = 'https://app.vinaybhaskar.in';
    } else if (origin === 'Sarvodaya') {
      this.originURL = 'https://app.sarvodaya.ngo';
    }
    this.getLogoDetails();
  }
  getLogoDetails = () => {
    const data = { 'origin_url': this.originURL };
    this.httpClient.post<ICommonInterface>(AppConstants.API_URL + 'flujo_client_logodisplay', data)
      .subscribe(
      res => {
        if (!res.error) {
          this.clientLogo = res.result[0]['logo_image'];
          this.client_id = res.result[0]['client_id'];
        } else {
          console.log('Something went wrong with logo collection.');
        }
        console.log(res);
        // this.hideLogin = false;
        // if (res.custom_status_code === 100) {
        //   this.alertService.success('Password sent to your Email successfully');
        // } else if (res.custom_status_code === 111) {
        //   this.alertService.danger('Failed to send email');
        // } else if (res.custom_status_code === 101) {
        //   this.alertService.danger('Required parameters are missing');
        // } else if (res.custom_status_code === 107) {
        //   this.alertService.danger('Email does not exist');
        // } else {
        //   this.alertService.danger('Please enter valid details');
        // }
        // this.spinnerService.hide();
      }, loginResp => {
        console.log(loginResp);
      });
  }

  onformSubmit = (body) => {
    this.passwordForm.controls['client_id'].setValue(this.client_id);
    const formModel = this.passwordForm.value;
    this.httpClient.post<ICommonInterface>(AppConstants.API_URL + 'flujo_client_postforgotpassword', formModel)
      .subscribe(
      data => {
        // this.isLoggedIn = true;
        console.log(data.result);
        // this.loginData = data.result;
        if (data.custom_status_code === 100) {
          this.alertService.success('Email sent successfully');
        } else if (data.custom_status_code === 111) {
          this.alertService.danger('Failed to send email');
        } else if (data.custom_status_code === 101) {
          this.alertService.danger('Required parameters are missing');
        } else if (data.custom_status_code === 107) {
          this.alertService.danger('Email does not exist');
        } else {
          this.alertService.danger('Please enter valid details');
        }
        this.spinnerService.hide();
      });
  }

  onSubmit = (body) => {
    if (this.originURL.length > 2) {
      // this.spinnerService.show();
      this.isLoggedIn = false;
      localStorage.clear();
      localStorage.setItem('client_name', this.originClientName);
      // this.loginForm.controls['origin_url'].setValue(window.location.href);
      // this.loginForm.controls['origin_url'].setValue('https://app.sarvodaya.in');
      // this.loginForm.controls['origin_url'].setValue('https://dashboard.vinaybhaskar.in');
      // this.loginForm.controls['origin_url'].setValue('https://dashboard.sarvodaya.ngo');
      // this.loginForm.controls['origin_url'].setValue('https://dashboard.artrepubliq.com');
      this.loginForm.controls['origin_url'].setValue(this.originURL);
      const formModel = this.loginForm.value;
      this.httpClient.post<ICommonInterface>(AppConstants.API_URL + 'flujo_client_login', formModel)
        .subscribe(
        data => {
          this.isLoggedIn = true;
          console.log(data.result);
          this.loginData = data.result;
          if (data.custom_status_code === 100) {
            this.loginForm.reset();
            this.loginAuthService._setSession(data.result[0]);
            if (this.loginData[0].email_verified === 0) {
              const feature_id = 23;
              // this.accessDataModel.setUserAccessLevels(null, feature_id, 'admin/changepassword');
              this.redirectUrlForChatCamp(this.loginData[0]);
            }
            this.alertService.success('User logged in successfully');
          } else if (data.custom_status_code === 140) {
            this.alertService.danger('Not a valid user!');
          } else {
            this.spinnerService.hide();
            this.alertService.danger('Please enter valid details');
          }
        }, loginResp => {
          this.isLoggedIn = false;
          console.log(loginResp);
        });
    } else {
      this.alertService.info('Please select client');
    }
  }
  redirectUrlForChatCamp = (data: IcustomLoginModelDetails) => {
    let chatCampPostObject: IPostChatCampModel;
    chatCampPostObject = <IPostChatCampModel>{};
    chatCampPostObject.chatcamp_accesstoken = data.chatcamp_accesstoken;
    chatCampPostObject.user_id = data.user_id;
    this.httpClient.post<IcustomLoginModelDetails>(AppConstants.API_URL + 'flujo_client_postchatservice', chatCampPostObject)
      .subscribe(
      chatResponse => {
        console.log(chatResponse);
      },
      chatError => {
        console.log(chatError);
      }
      );
  }

  showForgotPassword() {
    console.log('Show forgot password');
    this.hideLogin = true;
  }

  showLogin() {
    console.log('show login');
    this.hideLogin = false;
  }
}

// import { Component, OnInit } from '@angular/core';
// import { Subscription } from 'rxjs/Subscription';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
// import { HttpService } from '../service/httpClient.service';
// import { HttpClient } from '@angular/common/http';
// import { AppConstants } from '../app.constants';
// import { AlertModule, AlertService } from 'ngx-alerts';
// // We haven't defined these services yet
// // import { AuthService } from '../auth.service';
// // import { AuthService } from '../auth/auth.service';
// import { LoginAuthService } from '../auth/login.auth.service';
// import { Router } from '@angular/router';
// import { Keepalive } from '@ng-idle/keepalive';
// import { IcustomLoginModelDetails, IPostChatCampModel } from '../model/custom.login.model';
// import { error } from 'util';
// import { IHttpResponse } from '../model/httpresponse.model';
// import { Location } from '@angular/common';
// import { ICommonInterface } from '../model/commonInterface.model';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.scss']
// })
// export class LoginComponent implements OnInit {
//   loginData: IcustomLoginModelDetails[];
//   chatCampUrlData: any;
//   public isLoggedIn = true;
//   EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
//   loginForm: FormGroup;
//   constructor(private router: Router, private alertService: AlertService,
//     private formBuilder: FormBuilder, private spinnerService: Ng4LoadingSpinnerService,
//     private httpClient: HttpClient, private loginAuthService: LoginAuthService,
//     public location: Location) {
//     this.loginForm = this.formBuilder.group({
//       // 'user_name': ['', Validators.required],
//       'email': ['', Validators.compose([Validators.required, Validators.pattern(this.EMAIL_REGEXP)])],
//       'password': ['', Validators.required],
//       'origin_url': [null]
//     });
//     if (this.loginAuthService.authenticated) {
//       this.router.navigate(['/admin']);
//     } else {
//       this.router.navigate(['/login']);
//     }
//   }
//   // When this component is loaded, we'll call the dealService and get our public deals.
//   ngOnInit() {
//     localStorage.setItem('isLoginPageLoads', 'true');
//   }

//   onSubmit = (body) => {
//     // this.spinnerService.show();
//     this.isLoggedIn = false;
//     localStorage.clear();
//     // this.loginForm.controls['origin_url'].setValue(window.location.href);
//     this.loginForm.controls['origin_url'].setValue('https://dashboard.vinaybhaskar.in');
//     // this.loginForm.controls['origin_url'].setValue('https://dashboard.sarvodaya.in');
//     const formModel = this.loginForm.value;
//     this.httpClient.post<ICommonInterface>(AppConstants.API_URL + 'flujo_client_login', formModel)
//       .subscribe(
//         data => {
//           this.isLoggedIn = true;
//           console.log(data.result);
//           this.loginData = data.result;
//           if (data.custom_status_code === 100) {
//             this.loginForm.reset();
//             this.loginAuthService._setSession(data.result[0]);
//             if (this.loginData[0].email_verified === '0') {
//               this.redirectUrlForChatCamp(this.loginData[0]);
//             }
//             this.alertService.success('User logged in successfully');
//           } else if (data.custom_status_code === 140) {
//             this.alertService.danger('Not a valid user!');
//           } else {
//             this.spinnerService.hide();
//             this.alertService.danger('Please enter valid details');
//           }
//         }, loginResp => {
//           this.isLoggedIn = false;
//           console.log(loginResp);
//         });
//   }
//   redirectUrlForChatCamp = (data: IcustomLoginModelDetails) => {
//     let chatCampPostObject: IPostChatCampModel;
//     chatCampPostObject = <IPostChatCampModel>{};
//     chatCampPostObject.chatcamp_accesstoken = data.chatcamp_accesstoken;
//     chatCampPostObject.user_id = data.user_id;
//     this.httpClient.post<IcustomLoginModelDetails>(AppConstants.API_URL + 'flujo_client_postchatservice', chatCampPostObject)
//       .subscribe(
//         chatResponse => {
//           console.log(chatResponse);
//         },
//         chatError => {
//           console.log(chatError);
//         }
//       );
//   }
// }
