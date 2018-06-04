import { Injectable } from '@angular/core';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { AppConstants } from '../app.constants';
// import * as crypto from 'crypto';
@Injectable()
export class AuthInterceptorService {
  public getToken(): string {
    return localStorage.getItem('token');
  }
  public getDomain(): string {
    return localStorage.getItem('domain_name');
  }
  public isAuthenticated(): boolean {
    // get the token
    const token = this.getToken();
    // return a boolean reflecting
    // whether or not the token is expired
    return tokenNotExpired(null, token);
  }
}
