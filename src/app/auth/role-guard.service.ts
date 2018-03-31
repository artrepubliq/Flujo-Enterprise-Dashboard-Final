import { Injectable } from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot} from '@angular/router';
import { LoginAuthService } from '../auth/login.auth.service';
import { AuthGuard } from '../auth/auth.guard';
import { AdminComponent } from './admin.component';
@Injectable()
export class RoleGuardService {

  constructor(public loginAuthService: LoginAuthService, public router: Router, public adminComponent: AdminComponent) { }
  // canActivate(route: ActivatedRouteSnapshot): boolean {
  //   const expectedRole = route.data.expectedRole;
  //   const role = this.adminComponent.userAccessLevelData;
  //   console.log(this.adminComponent.userAccessLevelData);
  //   if (!this.loginAuthService.getCustomLoginStatus() || this.adminComponent.userAccessLevelData !== role) {
  //     this.router.navigate(['login']);
  //     return false;
  //   }
  //   return true;
  // }
}
