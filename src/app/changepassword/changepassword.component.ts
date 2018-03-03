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
import { AuthService } from '../auth/auth.service';
import { LoginAuthService } from '../auth/login.auth.service';
import { Router } from '@angular/router';
import { Keepalive } from '@ng-idle/keepalive';
import { IcustomLoginModelDetails } from '../model/custom.login.model';
import { PasswordValidation } from '../service/confirm-password';
@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent implements OnInit {

  changePasswordForm: any;
  constructor(private router: Router, private alertService: AlertService,
    private formBuilder: FormBuilder, private spinnerService: Ng4LoadingSpinnerService, private httpClient:HttpClient) {
      this.changePasswordForm = this.formBuilder.group({
        'old_password':['', Validators.required],
        'password':['', Validators.required],
        'confirm_password':['', Validators.required],
        'client_id' : [null]
      });
   }

  ngOnInit() {
  }
  onSubmit = (body) => {
    this.spinnerService.show();
    this.changePasswordForm.controls['client_id'].setValue(AppConstants.CLIENT_ID);
    const formModel = this.changePasswordForm.value;
    this.httpClient.post(AppConstants.API_URL + 'flujo_client_postcreateuser', formModel)
      .subscribe(
      data => {
        this.changePasswordForm.reset();
        this.alertService.info('Password was changed succesfully');
        this.spinnerService.hide();
      },
      error => {
        this.spinnerService.hide();
        this.alertService.danger('Password was not changed');
      });
  }
}
