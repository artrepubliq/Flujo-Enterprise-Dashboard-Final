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
      window.alert('close session');
      this.router.navigate(['/login']);
      // this.clearLocalStorage();
    } else {
      return;
    }

  }
  public _setSession(authResult) {
    const expTime = 60 * 60 * 1000 + Date.now();
    // Save session data and update login status subject
    localStorage.setItem('token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('email', authResult.email);
    localStorage.setItem('user_id', authResult.user_id);
    localStorage.setItem('name', authResult.name);
    localStorage.setItem('expires_at', String(expTime));
    this.router.navigate(['/admin']);
    this.setLoggedInCustom(true);
  }
  getCustomLoginStatus() {
    return this.customLoggedIn;
  }

  logout(status) {
    if (!status) {
      this.router.navigate(['/login']);
      this.httpClient.delete(AppConstants.API_URL + 'flujo_client_deleteloginuser/' + localStorage.user_id)
      .subscribe(
        data => {
        },
        error => {
        });
        this.clearLocalStorage();
    }
  }
  clearLocalStorage = () => {
  // Remove tokens and profile and update login status subject
  localStorage.removeItem('token');
  localStorage.removeItem('id_token');
  localStorage.removeItem('user_id');
  localStorage.removeItem('name');
  localStorage.removeItem('expires_at');
  localStorage.removeItem('email');
  localStorage.removeItem('editor_source');
  this.setLoggedInCustom(false);
  }
  get authenticated(): boolean {
    // Check if current date is greater than expiration
    if (this.customLoggedIn) {
      this.setLoggedInCustom(Date.now() < this.expiresAt);
    } else {
      return;
    }
    // return Date.now() < expiresAt;
  }

}
