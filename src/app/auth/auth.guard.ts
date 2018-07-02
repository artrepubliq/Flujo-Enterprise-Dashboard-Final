import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { LoginAuthService } from '../auth/login.auth.service';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private loginAuthService: LoginAuthService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // console.log(this.loginAuthService.getCustomLoginStatus());
    //   if (!this.loginAuthService.getCustomLoginStatus()) {
    //     this.router.navigate(['/']);
    //     return false;
    //   }
     return true;
  }
}
