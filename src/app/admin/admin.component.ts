import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { LoginAuthService } from '../auth/login.auth.service';

@Component({
  templateUrl: './admin.component.html',
  styleUrls: ['../app.component.scss']

})
export class AdminComponent implements OnInit {
  public nickName: string;

  constructor(public loginAuthService: LoginAuthService) {
    this.loginAuthService.modelShow=true;
   }
  ngOnInit(): void {
    this.nickName = localStorage.getItem("nickname");
    this.loginAuthService.modelShow=false;
  }
  viewPages() {
    localStorage.setItem("page_item", "viewpages");
  }
  addPages() {
    localStorage.setItem("page_item", "addpages");
  }

}