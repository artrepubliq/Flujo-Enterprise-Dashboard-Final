import { Component, OnInit, Inject, Injectable } from '@angular/core';
// import { AuthService } from '../auth/auth.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';
import { LoginAuthService } from '../auth/login.auth.service';
import { HttpClient } from '@angular/common/http';
import * as _ from 'underscore';
import { IHttpResponse } from '../model/httpresponse.model';
import { AppConstants } from '../app.constants';

import {MatIconModule} from '@angular/material/icon';

import { IloggedinUsers } from '../model/createUser.model';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { CreateUserComponentComponent, AccessLevelPopup } from '../create-user-component/create-user-component.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AlertService } from 'ngx-alerts';
import { IAccessLevelModel } from '../model/accessLevel.model';
import { UseraccessServiceService } from '../service/useraccess-service.service';

@Component({
  templateUrl: './admin.component.html',
  styleUrls: ['../app.component.scss']

})
export class AdminComponent implements OnInit {
  userAccessData: any;
  userAccessLevelData: IAccessLevelModel;
  userAccessLevelObject: any;
  filteredAccessIds: any;
  isUserActive: boolean;
  CurrentPageName: string;
  activeUsers: Array<IloggedinUsers>;
  loggedinUsersList: Array<IloggedinUsers>;
  userList: Array<IloggedinUsers>;
  sidebarToggledButton: boolean;
  dropdownOpen: boolean;
  public name: string;
  createUserList: CreateUserComponentComponent;
  config: any;
 loggedinIds: Array<string>;
  constructor(public loginAuthService: LoginAuthService,
    public httpClient: HttpClient,
    public mScrollbarService: MalihuScrollbarService,
    titleService: Title, private router: Router, activatedRoute: ActivatedRoute, public dialog: MatDialog,
    private spinnerService: Ng4LoadingSpinnerService) {

      router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          const title = this.getTitle(router.routerState, router.routerState.root).join('-');
          if (title) {
            // console.log('title', title);
            this.CurrentPageName = title;
            titleService.setTitle(title);
          } else {
            this.CurrentPageName = '';
          }
        }
      });
    this.getUserList();
   this.getUserAccessLevelData();
  }
  ngOnInit(): void {
    this.name = localStorage.getItem('name');
    this.mScrollbarService.initScrollbar('#sidebar-wrapper', { axis: 'y', theme: 'minimal' });
    this.isUserActive = false;
    // console.log(this.userAccessService.getUserAccessLevelData());
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
            this.isUserActive = false;
            return  activeUserData.id !== localStorage.getItem('id_token') ;
        });
        if (this.activeUsers) {
          _.each(this.activeUsers, (iteratee, index) => {
            if (this.activeUsers[index].is_logged_in === '1' && localStorage.getItem('user_id')) {
              this.activeUsers[index].isUserActive = true;
              // this.filteredAccessIds = this.activeUsers;
            }
          });
          this.activeUsers =  _.filter(this.activeUsers, (filteredactiveUserData) => {
            return filteredactiveUserData.id !== localStorage.getItem('user_id');
          });
        } else {
           console.log('There are no active users');
        }
      },
      error => {
        console.log(error);
      }
      );
  }
  getTitle(state, parent) {
    const data = [];
    if (parent && parent.snapshot.data && parent.snapshot.data.title) {
      data.push(parent.snapshot.data.title);
    }

    if (state && parent) {
      data.push(... this.getTitle(state, state.firstChild(parent)));
    }
    return data;
  }
  getUserAccessLevelData = () => {
    this.spinnerService.show();
    this.getUserAccessLevelsHttpClient()
      .subscribe(
        data => {
          _.each(data, item => {
            if (item.user_id === localStorage.getItem('user_id')) {
                this.userAccessLevelObject = item.access_levels;
                // console.log(this.userAccessLevelObject);
            } else {
              // this.userAccessLevelObject = null;
            }
          });
         if (this.userAccessLevelObject) {
          this.userAccessLevelData = JSON.parse(this.userAccessLevelObject);
          console.log(this.userAccessLevelData);
         } else {
          this.openDialog();
         }
        },
        error => {
          console.log(error);
          this.spinnerService.hide();
        }
      );
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(EmptyAccessLevelDialog, {
      width: '40vw',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  getUserAccessLevelsHttpClient() {
    return  this.httpClient.get<Array<IAccessLevelModel>>(AppConstants.API_URL + '/flujo_client_getuseraccess/' + AppConstants.CLIENT_ID);
  }

  whatsapp() {
this.router.navigate(['admin/whatsappflujo']);
  }


  sidebarToggleOpen() {
    this.sidebarToggledButton = true;
  }
  sidebarToggleClose() {
    this.sidebarToggledButton = false;
  }
}
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'emptyaccesslevelpopup',
  templateUrl: 'emptyaccesslevelpopup-example.html',
  styleUrls: ['../app.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class EmptyAccessLevelDialog {

  constructor(
    public dialogRef: MatDialogRef<EmptyAccessLevelDialog>, public loginAuthService: LoginAuthService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      dialogRef.disableClose = true;
     }

  onNoClick(): void {
    this.dialogRef.close();
  }
  logoutUser() {
    this.loginAuthService.logout();
    this.dialogRef.close();
  }
}
