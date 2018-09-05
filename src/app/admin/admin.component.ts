import { Component, OnInit, Output, Inject, Injectable, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatTabChangeEvent } from '@angular/material';
import { LoginAuthService } from '../auth/login.auth.service';
import { HttpClient } from '@angular/common/http';
import * as _ from 'underscore';
import { IHttpResponse } from '../model/httpresponse.model';
import { AppConstants } from '../app.constants';
import { MatIconModule } from '@angular/material/icon';
import { IActiveUsers } from '../model/createUser.model';
import { Title } from '@angular/platform-browser';
import {
  Router, ActivatedRoute, NavigationEnd, ActivatedRouteSnapshot,
  Event, NavigationStart, NavigationCancel, NavigationError
} from '@angular/router';
import { CreateUserComponentComponent } from '../create-user-component/create-user-component.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AlertService } from 'ngx-alerts';
import { IAccessLevelModel } from '../model/accessLevel.model';
import { ICommonInterface } from '../model/commonInterface.model';
import { AccessDataModelComponent } from '../model/useraccess.data.model';
import { WindowRef } from './window.service';
import { Pipe, PipeTransform, HostListener } from '@angular/core';
import { ClientUserAccessDenied } from '../dialogs/client-useraccess-denied/client-useraccess-denied.popup';
import { IUserFeatures, IUserAccessLevels } from '../model/user-accesslevels.model';
import { UserAccesslevelsService } from '../service/user-accesslevels.service';
declare var jquery: any;
declare var $window: any;
declare var $: any;
// import {ChatCamp} from './chatCamp';
/*End Chat Camp window initializaion*/
@Component({
  templateUrl: './admin.component.html',
  styleUrls: ['../app.component.scss']

})
export class AdminComponent implements OnInit {
  PreparedfeatureObject: IUserAccessLevels;
  userFeatureObjects: any;
  userFeaturesNames: string[];
  userFeatures: any;
  userAccessFeatures: IUserFeatures[];
  clientName: string;
  groupChatIndex: number;
  test: boolean;
  heroes = [{ name: 'UI', color: this.getRandomColor() }, { name: 'Design', color: this.getRandomColor() }
  ];
  // cc: any; ChatCampUI: any;
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
  config: any;
  loggedinIds: Array<number | string>;
  public user_id: string;
  label: boolean;
  letters: any;
  public color: any;
  stories: any;
  randombgcolors: any;
  randombgcolor: string;
  doSearch: boolean;
  // Arrays for Side nav menu and admin menu
  // tslint:disable-next-line:max-line-length
  editor = [{ feature_id: 1, title: 'Editor', router: 'admin/chooseplatform', activeicon: 'assets/icons/editor-color-nav-icon-active@2x.png', normalicon: 'assets/icons/editor-color-nav-icon-normal@2x.png', isActive: false }];

  // tslint:disable-next-line:max-line-length
  domain = [{ feature_id: 33, title: 'Domain', router: 'admin/domain', activeicon: 'assets/icons/editor-color-nav-icon-active@2x.png', normalicon: 'assets/icons/editor-color-nav-icon-normal@2x.png', isActive: false }];
  // tslint:disable-next-line:max-line-length
  drive = [{ feature_id: 11, title: 'Drive', router: 'admin/filerepository', activeicon: 'assets/icons/editor-color-nav-icon-active@2x.png', normalicon: 'assets/icons/editor-color-nav-icon-normal@2x.png', isActive: false }];
  // tslint:disable-next-line:max-line-length
  flow = [{ feature_id: 1, title: 'Social', router: 'admin/social_login', activeicon: 'assets/icons/social-color-nav-icon-active@2x.png', normalicon: 'assets/icons/social-color-nav-icon-normal@2x.png', isActive: false },
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
    { feature_id: 29, title: 'Social Configuration', router: 'admin/socialconfiguration' },
    { feature_id: 33, title: 'Domain Management', router: 'admin/domain' }
  ];
  accessDataModel: AccessDataModelComponent;
  isChatStarted: boolean;
  constructor(public loginAuthService: LoginAuthService,
    public httpClient: HttpClient,
    private titleService: Title,
    private router: Router, activatedRoute: ActivatedRoute, public dialog: MatDialog,
    private spinnerService: Ng4LoadingSpinnerService,
    private userAccesslevelsService: UserAccesslevelsService) {
    this.accessDataModel = new AccessDataModelComponent(httpClient, router);
    this.router.events.subscribe((event: Event) => {
      this.navigationInterceptor(event);
    });

    // GET FEATURE ACCESS, USER ACCESS LEVELS AND LOGDED IN USERS LIST
    this.getFeatureAndUserAccessLevels();
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const title = this.getTitle(this.router.routerState.snapshot.root);
        // console.log('title', title);
        titleService.setTitle(title);
        this.CurrentPageName = title;
      }
    });
  }
  ngOnInit(): void {
    // this.name = localStorage.getItem('name');
    this.user_id = localStorage.getItem('user_id');

    // this.mScrollbarService.initScrollbar('#sidebar-wrapper', { axis: 'y', theme: 'minimal' });
    this.isUserActive = false;
    // this.getUserList();
    const interval = setInterval(() => {
      if (Date.now() > Number(localStorage.getItem('expires_at'))) {
        this.loginAuthService.logout(false);
        clearInterval(interval);
      }
      this.getClientUsersList();

    }, 5000);
    const interval2 = setInterval(() => {
      if ((this.loggedinIds && !this.isChatStarted) || !window.ChatCampUI) {
        this.isChatStarted = true;
        // console.log('enter the dragan');
        // this.loadScript('/widget-example/static/js/main.428ae54a.js');
        // this.window.cc = window.cc || {};
        // this.window.ChatCampUI = window.ChatCampUI || {};
        // console.log(window);
      }
    }, 3000);
  }

  // GET FEATIRE ACCESS AND USER ACCESS AND LOGGED IN USER LIST
  getFeatureAndUserAccessLevels = async () => {
    const clientName: any = await this.getHostOriginUrlFromBrowser();
    this.clientName = clientName;
    const clientFeatureAccessLevel: any = await this.getClientFeatureAccessLevels();
      let userAccessLevels: any;
    try {
      userAccessLevels = await this.getClientUserAccessLevels();

    } catch (error) {
      console.log(error);
    }

    try {
      const loggedInUsers: any = await this.getClientUsersList();
      this.loggedinUsersList = loggedInUsers;
    } catch (usersListError) {
      console.log(usersListError);
    }
    if (!userAccessLevels.error && !clientFeatureAccessLevel.error) {
      // tslint:disable-next-line:max-line-length
      this.PreparedfeatureObject = this.userAccesslevelsService.prepareExistingUserAccessLevels(clientFeatureAccessLevel.result[0], userAccessLevels.result[0].access_levels);
      this.userFeatureObjects = this.PreparedfeatureObject.services[0];
      this.userFeaturesNames = Object.keys(this.PreparedfeatureObject.services[0]);
      console.log(this.userFeatureObjects);
    } else {
      console.log('No proper access permisssions');
    }
    console.log(clientName);
    console.log(clientFeatureAccessLevel);
    console.log(this.loggedinUsersList);
  }

  // GET HOST ORIGIN URL FROM BROWSER
  getHostOriginUrlFromBrowser = () => {
    return new Promise((resolve, reject) => {
      let clientName = '';
      const hostName: string = window.location.href;
      if (hostName.includes('http://')) {
        const split = hostName.split('http://');
        if (split && split[1].includes('.flujo.in')) {
          const splitHostName = split[1].split('.flujo.in');
          clientName = splitHostName[0];
        } else {
          clientName = 'Not Assigned';
        }
      } else if (hostName.includes('https://')) {
        const split = hostName.split('https://');
        if (split && split[1].includes('.flujo.in')) {
          const splitHostName = split[1].split('.flujo.in');
          clientName = splitHostName[0];
        } else {
          clientName = 'Not Assigned';
        }

      } else {
        clientName = 'Not Assigned';
      }
      resolve(clientName);
    });
  }
  // GET CLIENT FEATURE ACCESS LEVELS
  getClientFeatureAccessLevels = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.httpClient.get<ICommonInterface>(AppConstants.API_URL + 'flujo_client_getfat/' + AppConstants.CLIENT_ID).subscribe(
        succResp => {
          this.userAccessFeatures = succResp.result;
          console.log(succResp);
          resolve(succResp);
        }, errResp => {
          console.log(errResp);
          resolve(errResp);
        }
      );
    });
  }

  // GET USER ACCESS LEVELS
  getClientUserAccessLevels = () => {
    return new Promise((resolve, reject) => {
      // tslint:disable-next-line:max-line-length
      this.httpClient.get<ICommonInterface>(AppConstants.API_URL + 'flujo_client_getuseraccessbyuserid/' + localStorage.getItem('user_id')).subscribe(
        succResp => {
          resolve(succResp);
          // if (this.userAccessLevelObject) {
          //   this.userAccessLevelData = this.userAccessLevelObject;
          //   console.log(this.userAccessLevelData);
          //   // this.accessDataModel.setUserAccessLevels(this.userAccessLevelData, this.feature_id, 'admin');
          //   resolve(true);
          // } else {
          //   resolve(true);
          //   this.openClientUserAccessDeniedPopUp();
          // }
        }, errResp => {
          resolve(errResp);
        }
      );
    });
  }

  // GET CLIENT USERS LIST
  getClientUsersList = () => {
    return new Promise((resolve, reject) => {
      this.httpClient.get<ICommonInterface>(AppConstants.API_URL + 'flujo_client_getlogin/' + AppConstants.CLIENT_ID)
      .subscribe(
        data => {
          this.activeUsers = data.result;
          const loggedinUsersList = _.filter(this.activeUsers, (activeUserData: IActiveUsers) => {
            // tslint:disable-next-line:radix
            return activeUserData.id !== parseInt(localStorage.getItem('user_id'));
          });
          if (loggedinUsersList) {
            this.StoredLoggedinIds();
            resolve(loggedinUsersList);
          }
        },
        error => {
          console.log(error);
          reject('login users list is empty.');
        }
      );
    });
  }
  private navigationInterceptor(event: Event): void {
    if (event instanceof NavigationStart) {
      this.spinnerService.show();
    }
    if (event instanceof NavigationEnd) {
      this.spinnerService.hide();
    }

    // Set loading state to false in both of the below events to hide the loader in case a request fails
    if (event instanceof NavigationCancel) {
      this.spinnerService.hide();
    }
    if (event instanceof NavigationError) {
      this.spinnerService.hide();
    }
  }
  public getTitle(routeSnapshot: ActivatedRouteSnapshot): any {
    let data = [];
    data = routeSnapshot.data ? routeSnapshot.data['title'] : '';
    if (routeSnapshot.firstChild) {
      data = this.getTitle(routeSnapshot.firstChild) || data;
    }
    return data;
  }
  // ngAfterViewInit(): void {
  //   const interval2 = setInterval(() => {
  //     if ((this.loggedinIds && !this.isChatStarted) || !window.ChatCampUI) {
  //       this.isChatStarted = true;
  //       console.log('enter the dragan');
  //       // this.loadScript('/widget-example/static/js/main.428ae54a.js');
  //       // this.windowRef.cc = window.cc || {};
  //       // window.ChatCampUI = window.ChatCampUI || {};
  //       // console.log(window);
  //       this.ChatIO();
  //     }
  //   }, 3000);

  //   }

  // page navigations
  navigatePage = (router) => {
    this.router.navigate([router]);
    // _.each(this.flow, (iteratee, i) => { this.flow[i].isActive = false; });
    // _.each(this.nucleus, (iteratee, i) => { this.nucleus[i].isActive = false; });
    // _.each(this.drive, (iteratee, i) => { this.nucleus[i].isActive = false; });
    // if (menuid === 'flow') {
    //   this.flow[index].isActive = true;
    // } else if (menuid === 'nucleus') {
    //   this.nucleus[index].isActive = true;
    // } else if (menuid === 'drive') {
    //   this.drive[index].isActive = true;
    // }
    // localStorage.setItem('feature_id', page.feature_id);
    // this.CurrentPageName = page.title;
    // this.accessDataModel.setUserAccessLevels(this.userAccessLevelData, feature.feature_id, feature.feature_router);
  }
  // ChatIO = () => {
  //   // console.log(this.window);

  //   /* tslint:disable */
  //   window.cc.GroupChannel.create('Team', this.loggedinIds, true, function (error, groupChannel) {
  //     if (error == null) {
  //       // console.log('New Group Channel has been created', groupChannel);
  //       window.ChatCampUI.startChat(groupChannel.id);
  //     }
  //   });
  //   /* tslint:enable */
  // }
  viewPages() {
    localStorage.setItem('page_item', 'viewpages');
  }
  addPages() {
    localStorage.setItem('page_item', 'addpages');
  }

  // getting logged in ids for chatcamp
  StoredLoggedinIds = () => {
    this.loggedinIds = [this.user_id];
    _.each(this.loggedinUsersList, (loggedinUser: IActiveUsers) => {
      if (loggedinUser.is_logged_in === '1' && loggedinUser.can_chat) {
        this.loggedinIds.push(loggedinUser.id);
      }
    });
  }

  OnetoOne = (chatItem) => {

    // console.log(this.window);
    const OnetoOne = [this.user_id];
    OnetoOne.push(String(chatItem.id));
    /* tslint:disable */
    window.cc.GroupChannel.create('Team', OnetoOne, true, (error, groupChannel) => {
      if (error == null) {
        // console.log('New one to one Channel has been created', groupChannel);
        window.ChatCampUI.startChat(groupChannel.id);
      }
    });
    /* tslint:enable */
  }
  openClientUserAccessDeniedPopUp(): void {
    const dialogRef = this.dialog.open(ClientUserAccessDenied, {
      width: '40vw',
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
    });
  }
  getUserAccessLevelsHttpClient() {

    // return  this.httpClient.get<ICommonInterface>(AppConstants.API_URL + '/flujo_client_getuseraccess/' + AppConstants.CLIENT_ID);

    return this.httpClient.get<ICommonInterface>(AppConstants.API_URL + 'flujo_client_getuseraccess/' + AppConstants.CLIENT_ID);
  }
  sidebarToggleOpen() {
    this.sidebarToggledButton = true;
  }
  sidebarToggleClose() {
    this.sidebarToggledButton = false;
  }

  onLinkClick(event: MatTabChangeEvent) {
    this.groupChatIndex = event.index;
    this.randombgcolor = this.getRandomColor();
    if (event.index === 1) {
      this.label = true;
    } else {
      this.label = false;
    }
  }
  public getrandomBackground() {
    const letters = '0123456789ABCDEF'.split('');
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;

  }
  public searchChatData($event) {
    this.doSearch = true;
    $event.stopPropagation();
  }
  public gobacktoChatUsers($event) {
    this.doSearch = false;
    $event.stopPropagation();
  }

  getRandomColor() {
    const color = Math.floor(0x1000000 * Math.random()).toString(16);
    const randcolor = '#' + ('000000' + color).slice(-6);
    return randcolor;
  }
}
