import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl : './app.component.html',
  styleUrls : ['./app.component.scss']
})
export class AppComponent {
  title = 'flujo dasboard';

  constructor(public authService: AuthService) {
    localStorage.setItem("client_id", "1232");
  }
}
