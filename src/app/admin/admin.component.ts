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
  activeUsers: Array<IloggedinUsers>;
  loggedinUsersList: Array<IloggedinUsers>;
  userList: Array<IloggedinUsers>;
  public nickName: string;
  createUserList: CreateUserComponentComponent;
 loggedinIds: Array<string>;
  constructor(public loginAuthService: LoginAuthService,
    public httpClient: HttpClient,
    public mScrollbarService: MalihuScrollbarService) {
    this.getUserList();
  }
  ngOnInit(): void {
    this.nickName = JSON.parse(localStorage.getItem('nickname'));
    this.mScrollbarService.initScrollbar('#sidebar-wrapper', { axis: 'y', theme: 'minimal' });
    this.isUserActive = false;
    this.getUserList();
    setInterval(() => {
      this.getUserList();
    }, 5000);
  }

  ChatIO = (chatItem) => {

    // const  = [];

    const window: any = Window;

    window.cc.GroupChannel.create('Team', this.loggedinIds, true, function(error, groupChannel) {
     if (error == null) {
       console.log('New Group Channel has been created', groupChannel);
       window.ChatCampUI.startChat(groupChannel.id);
      }
    });
 }
  viewPages() {
    localStorage.setItem('page_item', 'viewpages');
  }
  addPages() {
    localStorage.setItem('page_item', 'addpages');
  }

  // getting logged in ids for chatcamp
  StoredLoggedinIds = () => {
    this.loggedinIds = [];

    _.each(this.loggedinUsersList, (loggedinUser: IloggedinUsers) => {
      const loggedInId = loggedinUser.id;
      this.loggedinIds.push(loggedInId);
     });
  }

  // getting users list who are logged in
  getUserList = () => {
    this.httpClient.get<Array<IloggedinUsers>>(AppConstants.API_URL + 'flujo_client_getlogin/' + AppConstants.CLIENT_ID )
    .subscribe(
      data => {
          this.loggedinUsersList = data;
          this.StoredLoggedinIds();
          this.activeUsers = _.filter(this.loggedinUsersList, (activeUserData) => {
            return  activeUserData.id !== localStorage.getItem('id_token') ;
        });
        if (this.activeUsers) {
          _.each(this.activeUsers, (iteratee, index) => {
            if (this.activeUsers[index].is_logged_in === '1') {
              this.activeUsers[index].isUserActive = true;
            }
          });
        }else {
           console.log('There are no active users');
        }
      },
      error => {
        console.log(error);
      }
      );
  }
}
