import { Component, OnInit, Inject } from '@angular/core';
// import { AuthService } from '../auth/auth.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';
import { LoginAuthService } from '../auth/login.auth.service';
import { HttpClient } from '@angular/common/http';
import * as _ from 'underscore';
import { IHttpResponse } from '../model/httpresponse.model';
import { AppConstants } from '../app.constants';

import {MatIconModule} from '@angular/material/icon';

import { IloggedinUsers } from '../model/createUser.model';
import { CreateUserComponentComponent } from '../create-user-component/create-user-component.component';

@Component({
  templateUrl: './admin.component.html',
  styleUrls: ['../app.component.scss']

})
export class AdminComponent implements OnInit {
  isUserActive: boolean;
  public activeUsers: Array<IloggedinUsers>;
  loggedinUsersList: Array<IloggedinUsers>;
  public nickName: string;
  createUserList: CreateUserComponentComponent;

  constructor(public loginAuthService: LoginAuthService,
    public httpClient: HttpClient,
    public mScrollbarService: MalihuScrollbarService) {
    this.getUserList();
  }
  ngOnInit(): void {
    this.nickName = localStorage.getItem('nickname');
    this.mScrollbarService.initScrollbar('#sidebar-wrapper', { axis: 'y', theme: 'minimal' });
    this.isUserActive = false;
    this.getUserList();
    setInterval(() => {
      this.getUserList();
    }, 5000);
  }
  viewPages() {
    localStorage.setItem('page_item', 'viewpages');
  }
  addPages() {
    localStorage.setItem('page_item', 'addpages');
  }
  getUserList = () => {
    this.httpClient.get<Array<IloggedinUsers>>(AppConstants.API_URL + 'flujo_client_getlogin/' + AppConstants.CLIENT_ID )
    .subscribe(
      data => {
        // console.log(data[0].is_logged_in);
          this.loggedinUsersList = data;
          // console.log(this.loggedinUsersList);
          this.activeUsers = _.filter(this.loggedinUsersList, (activeUserData) => {
            return activeUserData.is_logged_in === '1';
        });
        if (this.activeUsers) {
          _.each(this.activeUsers, (iteratee, index) =>{
            this.activeUsers[index].isUserActive = true;
          });
        }else{
          
        }
          // console.log(this.activeUsers);
      },
      error => {
        console.log(error);
      }
      );
  }
}
