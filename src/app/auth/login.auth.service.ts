import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as auth0 from 'auth0-js';
import { AUTH_CONFIG } from './auth-config';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import * as _ from 'underscore';

@Injectable()
export class LoginAuthService {

  clientProfileObject: any;
  // Create a stream of logged in status to communicate throughout app
  customLoggedIn: boolean;
  customLoggedIn$ = new BehaviorSubject<boolean>(this.customLoggedIn);

  constructor(private router: Router, private http: HttpClient) {
  }
  setLoggedInCustom(value: boolean) {
    // Update login status subject
    this.customLoggedIn$.next(value);
    this.customLoggedIn = value;
if(!this.customLoggedIn) {
  window.alert("close session");
  this.router.navigate(['/login']);
  this.clearLocalStorageData();
} else {
console.log('expired');
}

  }
  public _setSession(authResult) {
    const expTime = 600 * 1000 + Date.now();
    // Save session data and update login status subject
    localStorage.setItem('token', authResult.access_token);
    // console.log(localStorage.getItem('token'));
    localStorage.setItem('nickname', JSON.stringify(authResult.user_name));
    localStorage.setItem('expires_at', JSON.stringify(expTime));
    this.router.navigate(['/admin']);
    this.setLoggedInCustom(true);
  }
  getCustomLoginStatus() {
    return this.customLoggedIn;
  }
clearLocalStorageData(){
  localStorage.removeItem('token');
  localStorage.removeItem('expires_at');
  localStorage.removeItem('nickname');
}
  logout() {
    if (this.customLoggedIn) {
      this.router.navigate(['/login']);
      this.clearLocalStorageData();
      console.log(this.clearLocalStorageData());
    }
    // Remove tokens and profile and update login status subject
    this.setLoggedInCustom(false);
  }

  get authenticated(): boolean {
    // Check if current date is greater than expiration
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));

    if(this.customLoggedIn ) {
      this.setLoggedInCustom(Date.now() < expiresAt);
      console.log(expiresAt);
    }else {
return;
    }
      
    // return Date.now() < expiresAt;
  }

}
