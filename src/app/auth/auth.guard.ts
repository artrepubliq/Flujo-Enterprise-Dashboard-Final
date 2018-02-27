import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { LoginAuthService } from './login.auth.service';
import { Router } from '@angular/router';
import { Conditional } from '@angular/compiler';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService,private loginAuthService: LoginAuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // if (!this.authService.getLoginStatus()) {
     console.log( this.loginAuthService.getCustomLoginStatus());
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
