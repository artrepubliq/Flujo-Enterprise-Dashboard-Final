import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { AppConstants } from '../app.constants';
@Injectable()
export class AuthInterceptorService {
  public getToken(): string {
    return AppConstants.ACCESS_TOKEN;
  }
  public getClientId(): string {
    return AppConstants.CLIENT_ID;
  }
  public isAuthenticated(): boolean {
    // get the token
    const token = this.getToken();
    // return a boolean reflecting
    // whether or not the token is expired
    return tokenNotExpired(null, token);
  }
}
