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
import { Location } from '@angular/common';
import { AccessDataModelComponent } from '../model/useraccess.data.model';
import { ICommonInterface } from '../model/commonInterface.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginData: IcustomLoginModelDetails[];
  chatCampUrlData: any;
  accessDataModel: AccessDataModelComponent;
  EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
  loginForm: FormGroup;
  constructor(private router: Router, private alertService: AlertService,
    private formBuilder: FormBuilder, private spinnerService: Ng4LoadingSpinnerService,
    private httpClient: HttpClient, private loginAuthService: LoginAuthService,
    public location: Location) {
    this.accessDataModel = new AccessDataModelComponent(httpClient, router);
    this.loginForm = this.formBuilder.group({
      // 'user_name': ['', Validators.required],
      'email': ['', Validators.compose([Validators.required, Validators.pattern(this.EMAIL_REGEXP)])],
      'password': ['', Validators.required],
      'origin_url': [null]
    });
    if (this.loginAuthService.authenticated) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/login']);
    }
  }
  // When this component is loaded, we'll call the dealService and get our public deals.
  ngOnInit() {
    localStorage.setItem('isLoginPageLoads', 'true');
  }

  onSubmit = (body) => {
    this.spinnerService.show();
    localStorage.clear();
    this.loginForm.controls['origin_url'].setValue(window.location.href);
    const formModel = this.loginForm.value;
    this.httpClient.post<ICommonInterface>(AppConstants.API_URL + 'flujo_client_login', formModel)
      .subscribe(
        data => {
          console.log(data.result);
          this.loginData = data.result;
            if (data.custom_status_code === 100) {
              this.loginForm.reset();
                            this.loginAuthService._setSession(data.result[0]);
              // Dont remove reload
              window.location.reload();
              if (this.loginData[0].email_verified === '0') {
                const feature_id = 23;
                this.accessDataModel.setUserAccessLevels(null, feature_id, 'admin/changepassword');
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
          console.log(loginResp);
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
