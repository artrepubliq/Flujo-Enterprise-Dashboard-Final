import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

// We haven't defined these services yet
// import { AuthService } from '../auth.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService){
    if(this.authService.loggedIn){
    this.authService.logout();
    }
  }
  
  
  // When this component is loaded, we'll call the dealService and get our public deals.
  ngOnInit() {
    
  }

  
}
