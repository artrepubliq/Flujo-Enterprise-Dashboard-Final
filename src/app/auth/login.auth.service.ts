import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as auth0 from 'auth0-js';
import { AUTH_CONFIG } from './auth-config';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import * as _ from 'underscore';

@Injectable()
export class LoginAuthService implements OnInit {

  clientProfileObject: any;
  expiresAt: any;
  // Create a stream of logged in status to communicate throughout app
  customLoggedIn: boolean;
  customLoggedIn$ = new BehaviorSubject<boolean>(this.customLoggedIn);

  constructor(private router: Router, private http: HttpClient) {
    this.expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    if (Date.now() < this.expiresAt) {
      this.setLoggedInCustom(true);
      }else {
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
    } else {
      return;
    }

  }
  public _setSession(authResult) {
    const expTime = 600 * 1000 + Date.now();
    // Save session data and update login status subject
    localStorage.setItem('token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('nickname', JSON.stringify(authResult.user_name));
    localStorage.setItem('expires_at', JSON.stringify(expTime));
    this.router.navigate(['/admin']);
    this.setLoggedInCustom(true);
  }
  getCustomLoginStatus() {
    return this.customLoggedIn;
  }

  logout() {
    if (this.customLoggedIn) {
      this.router.navigate(['/login']);
    }
    // Remove tokens and profile and update login status subject
    localStorage.removeItem('token');
    localStorage.removeItem('expires_at');
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
