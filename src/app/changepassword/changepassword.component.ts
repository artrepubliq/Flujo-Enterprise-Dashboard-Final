import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { HttpService } from '../service/httpClient.service';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../app.constants';
import { AlertModule, AlertService } from 'ngx-alerts';
// We haven't defined these services yet
// import { AuthService } from '../auth.service';
import { AuthService } from '../auth/auth.service';
import { LoginAuthService } from '../auth/login.auth.service';
import { Router } from '@angular/router';
import { Keepalive } from '@ng-idle/keepalive';
import { IcustomLoginModelDetails } from '../model/custom.login.model';
import { PasswordValidation } from '../service/confirm-password';
import { IchangeDetails } from '../model/change-password.model';
import * as _ from 'underscore';
import { ICommonInterface } from '../model/commonInterface.model';
@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent implements OnInit {
  feature_id = 23;
  userId: void;
  name: string;
  data: string;
  isMatch: boolean;
  changePasswordForm: any;
  changeApiDetails: IchangeDetails;
  password: string;
  confirm_password: string;
  constructor(private router: Router, private alertService: AlertService, private loginAuthService: LoginAuthService,
    private formBuilder: FormBuilder, private spinnerService: Ng4LoadingSpinnerService, private httpClient: HttpClient) {
    this.changePasswordForm = this.formBuilder.group({
      'old_password': ['', Validators.required],
      'new_password': ['', Validators.required],
      'confirm_new_password': ['', Validators.required],
      'admin_id': [null],
      user_id: [null]
    }, { validator: this.checkPasswords });

  }
  checkPasswords(group: FormGroup) {
    const new_password = group.controls.new_password.value;
    const confirm_new_password = group.controls.confirm_new_password.value;

    return new_password === confirm_new_password ? null : { isMatch: true };

  }

  ngOnInit() {
    this.isMatch = false;
  }

  onSubmit = (body) => {
    this.spinnerService.show();
    // this.userId = localStorage.getItem('user_id')
    // console.log(localStorage.getItem('user_id'));
    this.changePasswordForm.controls['admin_id'].setValue(AppConstants.CLIENT_ID);
    this.changePasswordForm.controls['user_id'].setValue(localStorage.getItem('user_id'));
    const formModel = this.changePasswordForm.value;
    this.httpClient.post<ICommonInterface>(AppConstants.API_URL + 'flujo_client_updatepasswordcreateuser', formModel)
      .subscribe(
        data => {
          console.log(data);
          if (data.custom_status_code === 102) {
            this.alertService.warning('Everything is Up-to-date!!!');
          } else if (data.custom_status_code === 100) {
            this.alertService.success('Password updated successfully!!!');
            _.delay(de => {
              this.router.navigate(['/login']);
            }, 1000);
          } else if (data.custom_status_code === 101) {
            this.alertService.warning('Required Parameters are Missing!!!');
          } else if (data.custom_status_code === 119) {
            this.alertService.warning('Old password is incorrect!!!');
          } else if (data.custom_status_code === 120) {
            this.alertService.warning('Password length Should be at least 6 characters');
          }
          this.changePasswordForm.reset();
          this.spinnerService.hide();
        },
        error => {
          this.spinnerService.hide();
          this.alertService.danger('Password was not changed');
        });
  }
  cancelChangePassword = () => {
    this.changePasswordForm.reset();
  }
}
