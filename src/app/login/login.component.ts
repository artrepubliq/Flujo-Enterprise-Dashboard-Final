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
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: any;
  constructor(private router: Router, private alertService: AlertService,
    private formBuilder: FormBuilder, private spinnerService: Ng4LoadingSpinnerService,
    private httpClient: HttpClient, private authService: AuthService, private loginAuthService: LoginAuthService) {
    this.loginForm = this.formBuilder.group({
      // 'user_name': ['', Validators.required],
      'name': ['', Validators.pattern('^[a-zA-Z \-\']+')],
      'password': ['', Validators.required],
    });
    if (this.loginAuthService.authenticated) {
      this.router.navigate(['/admin']);
    }else {
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
          this.loginAuthService._setSession(data);
          this.alertService.success('User loged in successfully');
        }else {
          this.spinnerService.hide();
          this.alertService.danger('Please enter valid details');
        }
      });
  }
}
