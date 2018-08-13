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
    request = request.clone({
      setHeaders: {
        // Authorization: `${this.auth.getToken()}`,
        // tslint:disable-next-line:max-line-length
        Authorization: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9mbHVqby5pbiIsImF1ZCI6Imh0dHA6XC9cL2FwaS5mbHVqby5pbyIsInNpdGUiOiJodHRwOlwvXC92aW5heWJoYXNrYXIuaW4iLCJjbGllbnRfaWQiOiIxMjMyIn0.14_bUczI3_E6tbUaQco-UsfG3kJK3ru1xEkZDDbcMyE`,
        Accept: `${this.auth.getDomain()}`
      }
    });
    return next.handle(request);
  }
}
