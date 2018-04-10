import { Injectable, OnInit } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { LoginAuthService } from '../auth/login.auth.service';
import { AuthGuard } from '../auth/auth.guard';
import { UseraccessComponent } from '../useraccess/useraccess.component';
import * as _ from 'underscore';
import { LoginComponent } from '../login/login.component';
import { AlertService } from 'ngx-alerts';
import { FormBuilder } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class RoleGuardService implements OnInit {

  filteredUserAccessData: any;
  userAccessLevelData: any;
  MainUserAccessLevelObject: any;
  login: LoginComponent;
  constructor(private alertService: AlertService,
    private formBuilder: FormBuilder,
    private spinnerService: Ng4LoadingSpinnerService,
    private httpClient: HttpClient,
    public loginAuthService: LoginAuthService, public router: Router, private userAccessData: UseraccessComponent) {

    // const ttt = this.userAccessData.getUserAccessLevelData().subscribe(
    //   data => {
    //     console.log(data);
    //   }
    // );
  }
  ngOnInit() {
    const test = this.userAccessData.getUserAccessLevelData().subscribe(
      data => {
        console.log(data);
        _.each(data, item => {
          if (item.user_id === localStorage.getItem('user_id')) {
            this.MainUserAccessLevelObject = item.access_levels;
          } else {
          }
        });
        console.log(this.MainUserAccessLevelObject);
      }
    );

  }
  filtering() {
    if (this.MainUserAccessLevelObject) {
      this.userAccessLevelData = JSON.parse(this.MainUserAccessLevelObject);
      console.log(this.userAccessLevelData.name);
    } else {
      console.log('else role');
    }
    _.each(this.userAccessLevelData, (item, iterate) => {
      // tslint:disable-next-line:max-line-length
      this.filteredUserAccessData = item;
      console.log(this.filteredUserAccessData.name);
    });
    return this.filteredUserAccessData;
  }
  canActivate(route: ActivatedRouteSnapshot): boolean {
   return;
}

}
