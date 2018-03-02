import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { LoginAuthService } from '../auth/login.auth.service';
@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private loginAuthService: LoginAuthService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // if (!this.authService.getLoginStatus()) {
      if (!this.loginAuthService.getCustomLoginStatus()) {
      this.router.navigate(['/']);
     console.log(localStorage.getItem('expires_at'));
      return false;
    }
    // else{
    // this.router.navigate(['/dashboard']);
     return true;
    // }
  }
}
