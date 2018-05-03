import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as auth0 from 'auth0-js';
import { AUTH_CONFIG } from './auth-config';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import * as _ from 'underscore';

@Injectable()
export class AuthService {

  clientProfileObject: any;
  // Create Auth0 web auth instance
  auth0 = new auth0.WebAuth({
    clientID: AUTH_CONFIG.CLIENT_ID,
    domain: AUTH_CONFIG.CLIENT_DOMAIN,
    responseType: 'token id_token',
    redirectUri: AUTH_CONFIG.REDIRECT,
    audience: AUTH_CONFIG.AUDIENCE,
    scope: AUTH_CONFIG.SCOPE
  });
  userProfile: any;
  // Create a stream of logged in status to communicate throughout app
  loggedIn: boolean;
  loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);

  constructor(private router: Router, private http: HttpClient) {
    // If authenticated, set local profile property and update login status subject
    // If token is expired, log out to clear any data from localStorage
    if (this.authenticated) {
      // this.userProfile = JSON.parse(localStorage.getItem('profile'));
      this.userProfile = JSON.parse(localStorage.getItem('client_details'));
      this.setLoggedIn(true);
      // this.saveClientProfileInDB(this.userProfile);
      // console.log(this.userProfile);
    } else {
      this.logout();
    }


  }

  setLoggedIn(value: boolean) {
    // Update login status subject
    this.loggedIn$.next(value);
    this.loggedIn = value;
  }

  login() {
    // Auth0 authorize request
    this.auth0.authorize();
  }

  handleAuth() {
    // When Auth0 hash parsed, get profile
    this.auth0.parseHash(window.location.hash, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        // console.log(authResult);

        this._getProfile(authResult);
      } else if (err) {
        console.error(`Error: ${err.error}`);
      }
      _.delay(() => {
        this.router.navigate(['/admin']);

      }, 1000, 'arg1');
    });
  }

  private _getProfile(authResult) {
    // Use access token to retrieve user's profile and set session

    this.auth0.client.userInfo(authResult.accessToken, (err, profile) => {
      this._setSession(authResult, profile);

      console.log(authResult);
    });
  }

  private _setSession(authResult, profile) {
    const expTime = authResult.expiresIn * 1000 + Date.now();
    // Save session data and update login status subject
    localStorage.setItem('token', authResult.accessToken);
    console.log(localStorage.getItem('token'));
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('profile', JSON.stringify(profile));
    localStorage.setItem('name', profile.name);
    // localStorage.setItem('client_id', JSON.stringify(profile.aud));
    localStorage.setItem('client_details', JSON.stringify(authResult));
    localStorage.setItem('expires_at', JSON.stringify(expTime));
    this.userProfile = profile;


    this.setLoggedIn(true);

    // this.saveClientProfileInDB(authResult);
  }
  getLoginStatus() {
    return this.loggedIn;
  }

  logout() {
    if (this.loggedIn) {
      this.router.navigate(['/login']);
    }

    // Remove tokens and profile and update login status subject
    localStorage.removeItem('token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
    localStorage.removeItem('expires_at');
    this.userProfile = undefined;
    this.setLoggedIn(false);

  }

  get authenticated(): boolean {
    // Check if current date is greater than expiration
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    console.log(Date.now() < expiresAt);
    return Date.now() < expiresAt;
  }

  // saveClientProfileInDB(clientProfile) {
  //   // this.clientProfileObject = {"access_token": clientProfile.accessToken, "email":clientProfile.idTokenPayload.email

  //   const req = this.http.post(this.urlAdminAPI + 'Auth0_client_profile', this.clientProfileObject)
  //     .subscribe(
  //     res => {
  //       console.log(res);
  //     },
  //     err => {
  //       console.log(err);
  //     }
  //     );

  // }
}
