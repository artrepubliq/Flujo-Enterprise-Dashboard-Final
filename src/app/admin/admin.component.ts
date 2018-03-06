import { Component, OnInit, Inject } from '@angular/core';
// import { AuthService } from '../auth/auth.service';
import { LoginAuthService } from '../auth/login.auth.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';
import { HttpClient } from '@angular/common/http';
import * as _ from 'underscore';
import { IHttpResponse } from '../model/httpresponse.model';
import { AppConstants } from '../app.constants';
@Component({
  templateUrl: './admin.component.html',
  styleUrls: ['../app.component.scss']

})
export class AdminComponent implements OnInit {
  loggedinUsersList: Object;
  public nickName: string;


  constructor(public loginAuthService: LoginAuthService, private httpClient: HttpClient, private mScrollbarService: MalihuScrollbarService) {
    this.getUserList();
   }
  ngOnInit(): void {
    this.nickName = localStorage.getItem("nickname");
    this.mScrollbarService.initScrollbar('#sidebar-wrapper', { axis: 'y', theme: 'minimal' });
  }
  viewPages() {
    localStorage.setItem('page_item', 'viewpages');
  }
  addPages() {
    localStorage.setItem('page_item', 'addpages');
  }
  getUserList = () => {
    this.httpClient.get(AppConstants.API_URL + 'flujo_client_getlogin/' + AppConstants.CLIENT_ID )
    .subscribe(
      data => {
          this.loggedinUsersList = data;
          console.log(this.loggedinUsersList);
      },
      error => {
          console.log(error);
      }
      );
  }
}
