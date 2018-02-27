import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { LoginAuthService } from './auth/login.auth.service';
@Component({
  selector: 'app-root',
  templateUrl : './app.component.html',
  styleUrls : ['./app.component.scss']
})
export class AppComponent {
  title = 'flujo dasboard';

  constructor(public authService: AuthService,public loginAuthService: LoginAuthService) {
  }
}
