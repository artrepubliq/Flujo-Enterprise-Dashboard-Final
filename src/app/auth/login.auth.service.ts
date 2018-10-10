import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as auth0 from 'auth0-js';
import { AUTH_CONFIG } from './auth-config';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import * as _ from 'underscore';
import { IHttpResponse } from '../model/httpresponse.model';
import { AppConstants } from '../app.constants';
@Injectable()
export class LoginAuthService implements OnInit {

  clientProfileObject: any;
  expiresAt: any;
  // Create a stream of logged in status to communicate throughout app
  customLoggedIn: boolean;
  customLoggedIn$ = new BehaviorSubject<boolean>(this.customLoggedIn);
  constructor(private router: Router, private httpClient: HttpClient) {
    this.expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    if (Date.now() < this.expiresAt) {
      this.setLoggedInCustom(true);
    } else {
      this.setLoggedInCustom(false);
    }
  }
  ngOnInit() {
    // if (Date.now() < this.expiresAt) {
    // this.setLoggedInCustom(true);
    // }else {
    //   this.setLoggedInCustom(false);
    // }
  }
  setLoggedInCustom(value: boolean) {
    // Update login status subject
    this.customLoggedIn$.next(value);
    this.customLoggedIn = value;
    if (!this.customLoggedIn) {
      if (localStorage.getItem('isLoginPageLoads') === 'false') {
        window.alert('close session');
      }
      this.router.navigate(['/login']);
      // this.clearLocalStorage();
    } else {
      return;
    }

  }
  public _setSession(authResult) {
    const expTime = 600 * 60 * 1000 + Date.now();
    // Save session data and update login status subject
    localStorage.setItem('token', authResult.access_token);
    localStorage.setItem('client_id', authResult.client_id);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('domain_name', authResult.domain_name);
    localStorage.setItem('chat_token', authResult.chatcamp_accesstoken);
    localStorage.setItem('email', authResult.email);
    localStorage.setItem('user_id', authResult.user_id);
    localStorage.setItem('name', authResult.name);
    localStorage.setItem('expires_at', String(expTime));
    if (authResult.feature && authResult.feature[0] && authResult.feature[0].feature_access_token) {
      localStorage.setItem('feature_access_tokens', JSON.stringify(authResult.feature));
      // localStorage.setItem('token_expiry_date', authResult.feature[0].expiry_date);
    }
    this.router.navigate(['/admin']);
    this.setLoggedInCustom(true);
  }
  getCustomLoginStatus() {
    return this.customLoggedIn;
  }

  logout(status) {
    const user_id = localStorage.getItem('user_id');
    this.customLoggedIn = false;
    if (!status && localStorage.length > 0 && user_id && user_id.length > 0) {
      this.httpClient.delete(AppConstants.API_URL + 'flujo_client_deleteloginuser/' + localStorage.getItem('user_id'))
        .subscribe(
          data => {
            this.clearLocalStorage();
            this.router.navigate(['/login']);
          },
          error => {
            this.clearLocalStorage();
            this.router.navigate(['/login']);
          });
    } else {
      this.router.navigate(['/login']);
    }
  }
  clearLocalStorage = () => {
    // Remove tokens and profile and update login status subject
    localStorage.clear();
  }
  get authenticated(): boolean {
    // Check if current date is greater than expiration
    if (this.customLoggedIn) {
      this.setLoggedInCustom(Date.now() < this.expiresAt);
      return true;
    } else {
      return;
    }
    // return Date.now() < expiresAt;
  }

}
