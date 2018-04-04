import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { HttpService } from '../service/httpClient.service';
import { HttpClient } from '@angular/common/http';
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
import {Location} from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  chatCampUrlData: any;
  EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
  loginForm: any;
  constructor(private router: Router, private alertService: AlertService,
    private formBuilder: FormBuilder, private spinnerService: Ng4LoadingSpinnerService,
    private httpClient: HttpClient, private loginAuthService: LoginAuthService,
    public location: Location) {
    this.loginForm = this.formBuilder.group({
      // 'user_name': ['', Validators.required],
      'email': ['', Validators.compose([Validators.required, Validators.pattern(this.EMAIL_REGEXP)])],
      'password': ['', Validators.required],
    });
    if (this.loginAuthService.authenticated) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/login']);
    }
  }
  // When this component is loaded, we'll call the dealService and get our public deals.
  ngOnInit() {
  }

  onSubmit = (body) => {
    this.spinnerService.show();
    const formModel = this.loginForm.value;
    this.httpClient.post<IcustomLoginModelDetails>(AppConstants.API_URL + 'flujo_client_login', formModel)
      .subscribe(
      data => {
        if (data.status) {
          this.loginForm.reset();
          this.spinnerService.hide();
          // this.loginAuthService.setLoggedInCustom(true);
          console.log(data);
          this.loginAuthService._setSession(data);
          if (data.email_verified === '0') {
            this.router.navigate(['/admin/changepassword']);
          } else if (data.can_chat === false && data.email_verified === '1') {
           this.redirectUrlForChatCamp(data);
          }
          this.alertService.success('User logged in successfully');
        } else {
          this.spinnerService.hide();
          this.alertService.danger('Please enter valid details');
        }
      });
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
}
