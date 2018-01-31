import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { AuthInterceptorService } from '../auth/auth.interceptorservice';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public auth: AuthInterceptorService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      localStorage.clear();
      
    request = request.clone({
      setHeaders: {
        Authorization: `${this.auth.getToken()}`
      }
    });
    return next.handle(request);
  }
}