import { Component, OnInit, Output, Inject, Injectable, EventEmitter } from '@angular/core';
// import { AuthService } from '../auth/auth.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
// import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';
import { LoginAuthService } from '../auth/login.auth.service';
import { HttpClient } from '@angular/common/http';
import * as _ from 'underscore';
import { IHttpResponse } from '../model/httpresponse.model';
import { AppConstants } from '../app.constants';
import { MatIconModule } from '@angular/material/icon';
import { IActiveUsers } from '../model/createUser.model';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import {  AccessLevelPopup } from '../create-user-component/create-user-component.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AlertService } from 'ngx-alerts';
import { IAccessLevelModel } from '../model/accessLevel.model';
import { ICommonInterface } from '../model/commonInterface.model';
import { AccessDataModelComponent } from '../model/useraccess.data.model';

/*Start Chat Camp window initializaion to avoid build errors*/
declare global {
  interface Window { cc: any; ChatCampUI: any;}
}

window.cc = window.cc || {};

window.ChatCampUI = window.ChatCampUI || {};
/*End Chat Camp window initializaion*/

@Component({
  templateUrl: './admin.component.html',
  styleUrls: ['../app.component.scss']

})
export class AdminComponent implements OnInit {
  feature_id = 0;
  userAccessData: any;
  userAccessLevelData: Array<IAccessLevelModel>;
  userAccessLevelObject: any;
  filteredAccessIds: any;
  isUserActive: boolean;
  CurrentPageName = 'Profile';
  activeUsers: Array<IActiveUsers>;
  loggedinUsersList: Array<IActiveUsers>;
  userList: Array<IActiveUsers>;
  sidebarToggledButton: boolean;
  dropdownOpen: boolean;
  public name: string;
  createUserList: 
  config: any;
  loggedinIds: Array<string>;
  public user_id: string;
  // Arrays for Side nav menu and admin menu
  // tslint:disable-next-line:max-line-length
  editor = [{ feature_id: 1, title: 'Editor', router: 'admin/chooseplatform', activeicon: 'assets/icons/editor-color-nav-icon-active@2x.png', normalicon: 'assets/icons/editor-color-nav-icon-normal@2x.png', isActive: false }];

  // tslint:disable-next-line:max-line-length
  drive = [{ feature_id: 11, title: 'Drive', router: 'admin/filerepository', activeicon: 'assets/icons/editor-color-nav-icon-active@2x.png', normalicon: 'assets/icons/editor-color-nav-icon-normal@2x.png', isActive: false }];
  // tslint:disable-next-line:max-line-length
  flow = [{ feature_id: 1, title: 'Social', router: 'admin/social_management', activeicon: 'assets/icons/social-color-nav-icon-active@2x.png', normalicon: 'assets/icons/social-color-nav-icon-normal@2x.png', isActive: false },
  // tslint:disable-next-line:max-line-length
  { feature_id: 3, title: 'Mail', router: 'admin/email', activeicon: 'assets/icons/mail-color-nav-icon-active@2x.png', normalicon: 'assets/icons/mail-color-nav-icon-normal@2x.png', isActive: false },
  // tslint:disable-next-line:max-line-length
  { feature_id: 1, title: 'SMS', router: 'admin/sms', activeicon: 'assets/icons/sms-color-nav-icon-active@2x.png', normalicon: 'assets/icons/sms-color-nav-icon-normal@2x.png', isActive: false },
  // tslint:disable-next-line:max-line-length
  { feature_id: 32, title: 'WhatsApp', router: 'admin/whatsappflujo', activeicon: 'assets/icons/social-color-nav-icon-active@2x.png', normalicon: 'assets/icons/social-color-nav-icon-normal@2x.png', isActive: false }
  ];
  // tslint:disable-next-line:max-line-length
  nucleus = [{ feature_id: 1, title: 'Manage Reports', router: 'admin/managereports', activeicon: 'assets/icons/report-an-issue-color-nav-icon-active@2x.png', normalicon: 'assets/icons/report-an-issue-color-nav-icon-normal@2x.png', isActive: false },
  // tslint:disable-next-line:max-line-length
  { feature_id: 1, title: 'Feedback', router: 'admin/feedback', activeicon: 'assets/icons/feedback-color-nav-icon-active@2x.png', normalicon: 'assets/icons/feedback-color-nav-icon-normal@2x.png', isActive: false },
  // tslint:disable-next-line:max-line-length
  { feature_id: 1, title: 'Change Maker Report', router: 'admin/changemakerreport', activeicon: 'assets/icons/change-maker-color-nav-icon-active@2x.png', normalicon: 'assets/icons/change-maker-color-nav-icon-normal@2x.png', isActive: false },
  // tslint:disable-next-line:max-line-length
  { feature_id: 1, title: 'Surveys', router: 'admin/surveys', activeicon: 'assets/icons/survey-color-nav-icon-active@2x.png', normalicon: 'assets/icons/survey-color-nav-icon-normal@2x.png', isActive: false },
  // tslint:disable-next-line:max-line-length
  { feature_id: 1, title: 'Database', router: 'admin/database', activeicon: 'assets/icons/database-color-nav-icon-active@2x.png', normalicon: 'assets/icons/database-color-nav-icon-normal@2x.png', isActive: false },
  // tslint:disable-next-line:max-line-length
  { feature_id: 1, title: 'Analytics', router: 'admin/analytics', activeicon: 'assets/icons/analytics-color-nav-icon-active@2x.png', normalicon: 'assets/icons/analytics-color-nav-icon-normal@2x.png', isActive: false }
  ];
  adminMenu = [
    { feature_id: 13, title: 'Logo', router: 'admin/logo' },
    { feature_id: 14, title: 'Media Management', router: 'admin/media' },
    { feature_id: 15, title: 'Theme Global Configuration', router: 'admin/themeconfiguration' },
    { feature_id: 16, title: 'SMTP', router: 'admin/smtpconfiguration' },
    { feature_id: 17, title: 'User Management', router: 'admin/user' },
    { feature_id: 18, title: 'Social links update', router: 'admin/sociallinks' },
    { feature_id: 19, title: 'Biography', router: 'admin/biography' },
    { feature_id: 20, title: 'Create Module', router: 'admin/module' },
    { feature_id: 21, title: 'Terms & Conditions', router: 'admin/termsnconditions' },
    { feature_id: 22, title: 'Privacy & Policy', router: 'admin/privacynpolicy' },
    { feature_id: 23, title: 'Change Password', router: 'admin/changepassword' },
    { feature_id: 24, title: 'Problem Category', router: 'admin/problemcategory' },
    { feature_id: 25, title: 'Area Category', router: 'admin/areacategory' },
    { feature_id: 27, title: 'SMS Template Configuration', router: 'admin/smsconfiguration' },
    { feature_id: 28, title: 'Email Template', router: 'admin/emailconfiguration' },
    { feature_id: 29, title: 'Social Configuration', router: 'admin/socialconfiguration' }
  ];
  accessDataModel: AccessDataModelComponent;
  isChatStarted: boolean;
  constructor(public loginAuthService: LoginAuthService,
    public httpClient: HttpClient,
    private titleService: Title,
    private router: Router, activatedRoute: ActivatedRoute, public dialog: MatDialog,
    private spinnerService: Ng4LoadingSpinnerService) {
    this.accessDataModel = new AccessDataModelComponent(httpClient, router);
    this.getUserList();
    this.getUserAccessLevelsHttpClient().subscribe(
      resp => {
        _.each(resp.result, item => {
          if (item.user_id === localStorage.getItem('user_id')) {
            this.userAccessLevelObject = item.access_levels;
          } else {
            // this.userAccessLevelObject = null;
          }
        });
        if (this.userAccessLevelObject) {
          console.log(this.userAccessLevelObject);
          this.userAccessLevelData = this.userAccessLevelObject;
          this.accessDataModel.setUserAccessLevels(this.userAccessLevelData, this.feature_id, 'admin');
        } else {
          this.openDialog();
        }
      }, err => {
        console.log(err);
      }
    );
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const title = this.getTitle(router.routerState, router.routerState.root).join('-');
        console.log('title', title);
        titleService.setTitle(title);
        this.CurrentPageName = title;
      }
    });
  }
  public getTitle(state, parent): any[] {
    const data = [];
    if (parent && parent.snapshot.data && parent.snapshot.data.title) {
      data.push(parent.snapshot.data.title);
    }

    if (state && parent) {
      data.push(... this.getTitle(state, state.firstChild(parent)));
    }
    return data;
  }

  ngOnInit(): void {
    this.name = localStorage.getItem('name');
    this.user_id= localStorage.getItem('user_id');

    // this.mScrollbarService.initScrollbar('#sidebar-wrapper', { axis: 'y', theme: 'minimal' });
    this.isUserActive = false;
    this.getUserList();
    const interval = setInterval(() => {
      if (Date.now() > Number(localStorage.getItem('expires_at'))) {
        this.loginAuthService.logout(false);
        clearInterval(interval);
        }
      this.getUserList();
      if(this.loggedinIds && !this.isChatStarted){
        this.isChatStarted = true;
        this.ChatIO();
      }
    }, 5000);
  }
  // page navigations
  navigatePage = (page, index, menuid) => {
    _.each(this.flow, (iteratee, i) => { this.flow[i].isActive = false; });
    _.each(this.nucleus, (iteratee, i) => { this.nucleus[i].isActive = false; });
    _.each(this.drive, (iteratee, i) => { this.nucleus[i].isActive = false; });
    if (menuid === 'flow') {
      this.flow[index].isActive = true;
    } else if (menuid === 'nucleus') {
      this.nucleus[index].isActive = true;
    } else if (menuid === 'drive') {
      this.drive[index].isActive = true;
    }
    localStorage.setItem('feature_id', page.feature_id);
    // this.CurrentPageName = page.title;
    this.accessDataModel.setUserAccessLevels(this.userAccessLevelData, page.feature_id, page.router);
  }
  ChatIO = () => {

    window.cc.GroupChannel.create('Team', this.loggedinIds, true, function (error, groupChannel) {
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
    _.each(this.loggedinUsersList, (loggedinUser: IActiveUsers) => {
      if(loggedinUser.is_logged_in == '1' && loggedinUser.isUserCanChat){
         this.loggedinIds.push(loggedinUser.id);
        }
     });
  }

  OnetoOne = (chatItem) => {

    const OnetoOne = [this.user_id];
  
    OnetoOne.push(chatItem.id);
  
    window.cc.GroupChannel.create('Team', OnetoOne, true, (error, groupChannel) => {
     if (error == null) {
       console.log('New one to one Channel has been created', groupChannel);
       window.ChatCampUI.startChat(groupChannel.id);
      }
    });
  }
  // getting users list who are logged in
  getUserList = () => {
    this.httpClient.get<ICommonInterface>(AppConstants.API_URL + 'flujo_client_getlogin/' + AppConstants.CLIENT_ID)
      .subscribe(
        data => {
          this.activeUsers = data.result;
          this.loggedinUsersList = _.filter(this.activeUsers, (activeUserData: IActiveUsers) => {
            return  activeUserData.id !== localStorage.getItem('user_id') ;
        });
        if (this.loggedinUsersList) {
            this.StoredLoggedinIds();
        }
        },
        error => {
          console.log(error);
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

    // return  this.httpClient.get<ICommonInterface>(AppConstants.API_URL + '/flujo_client_getuseraccess/' + AppConstants.CLIENT_ID);

    return this.httpClient.get<ICommonInterface>(AppConstants.API_URL + '/flujo_client_getuseraccess/' + AppConstants.CLIENT_ID);
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
    this.dialogRef.close();
  }
}
