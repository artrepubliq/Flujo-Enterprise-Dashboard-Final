import { Component, OnInit, Output, Inject, Injectable, EventEmitter, ChangeDetectorRef } from '@angular/core';
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
import { WindowRef } from './window.service';
import { Pipe, PipeTransform, HostListener } from '@angular/core';
import { ClientUserAccessDenied } from '../dialogs/client-useraccess-denied/client-useraccess-denied.popup';
import { IUserFeatures, IUserAccessLevels } from '../model/user-accesslevels.model';
import { UserAccesslevelsService } from '../service/user-accesslevels.service';
import { BASE_ROUTER_CONFIG } from '../app.router-contstants';
import { AccessLevelPopup } from '../dialogs/create-useraccesslevels-popup/create-useraccesslevels-popup';
import { FormBuilder } from '@angular/forms';
import { SocketService } from '../service/socketservice.service';
import { ChatHttpApiService } from '../service/chat-http-api.service';
import { SocketConnectionListenerService } from '../service/socket-connection-listener.service';
import { IUserSocketResponseObject, IUser, ISendMessageObject } from '../model/users';
import { Subscription } from 'rxjs/Subscription';
import { ChatDockUsersService } from '../service/chat-dock-users.service';
declare var jquery: any;
declare var $window: any;
declare var $: any;
// import {ChatCamp} from './chatCamp';
/*End Chat Camp window initializaion*/
declare global {
  interface Window { ChatCampUi: any; ChatCampUI: any; }
}
window.ChatCampUi = window.ChatCampUi || {};

window.ChatCampUI = window.ChatCampUI || {};

window.ChatCampUi.cc = window.ChatCampUi.cc || {};
@Component({
  templateUrl: './admin.component.html',
  styleUrls: ['../app.component.scss']

})
export class AdminComponent implements OnInit {
  getLoginUserinterval: NodeJS.Timer;
  PreparedfeatureObject: IUserAccessLevels;
  PreparedSubfeaturesObject: any;
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
  isChatStarted: boolean;
  chatActiveUser: IUser[] = [];
  isSocketConnected: boolean;
  listOfUsers: IUser[];
  loggedinUserObject: IUser;
  constructor(public loginAuthService: LoginAuthService,
    public httpClient: HttpClient,
    private titleService: Title,
    private router: Router, activatedRoute: ActivatedRoute, public dialog: MatDialog,
    private spinnerService: Ng4LoadingSpinnerService,
    private userAccesslevelsService: UserAccesslevelsService,
    private chatDockUsersService: ChatDockUsersService,
    private socketService: SocketService,
    private cd: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private chatHttpApiService: ChatHttpApiService,
    private socketConnectionListenerService: SocketConnectionListenerService) {
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
    /*CHAT SOCKET CONNECTION*/
    this.socketConnectionListenerService.SockedConnectionAnnounced$.subscribe(
      connction => {
        console.log(connction, 'socket connection listener');
        if (this.isSocketConnected) {
          console.log('closed');
          this.isSocketConnected = false;
          this.socketService.closeSockectForThisUser();
          this.initializeSocket();
          // this.listenAllTheSocketServices();
        }
      }
    );
  }
  ngOnInit(): void {
    this.listOfUsers = [];
    this.spinnerService.show();
    this.name = localStorage.getItem('name');
    this.user_id = localStorage.getItem('user_id');
    this.loggedinUserObject = <IUser>{};
    this.loggedinUserObject._id = localStorage.getItem('user_id');
    this.loggedinUserObject.user_id = localStorage.getItem('user_id');
    this.loggedinUserObject.user_name = localStorage.getItem('name');
    this.InitChatIO();
    // this.mScrollbarService.initScrollbar('#sidebar-wrapper', { axis: 'y', theme: 'minimal' });
    this.isUserActive = false;
    // this.getUserList();
    this.getLoginUserinterval = setInterval(async () => {
      if (Date.now() > Number(localStorage.getItem('expires_at'))) {
        this.loginAuthService.logout(false);
        clearInterval(this.getLoginUserinterval);
      }
      const usersList = await this.getClientUsersList();

    }, 5000);
    const interval2 = setInterval(() => {
      if ((this.loggedinIds && !this.isChatStarted) || !window.ChatCampUI) {
        this.isChatStarted = true;
        // this.ChatIO();
      }
    }, 3000);
  }
  // LOGOUT THE USER
  onSubmitlogout = (status) => {
    clearInterval(this.getLoginUserinterval);
    this.loginAuthService.logout(status);
    this.loginAuthService = null;
  }
  InitChatIO = () => {
    window.ChatCampUi.init({
      appId: '6433231869877153792',
      user: {
        id: this.user_id,
        displayName: this.name, // optional
        // accessToken: "Ymk3OFR0VFNsSkhML3ZYSUpNNnVzUT09" // optional
      },
      ui: {
        theme: {
          primaryBackground: '#3f45ad',
          primaryText: '#ffffff',
          secondaryBackground: '#ffffff',
          secondaryText: '#000000',
          tertiaryBackground: '#f4f7f9',
          tertiaryText: '#263238'
        },
        roster: {
          tabs: ['recent', 'rooms', this.loggedinUsersList],
          render: false,
          defaultMode: 'hidden' // other possible values are minimize, hidden
        }
      }
    });
  }
  ChatIO = () => {
    window.ChatCampUi.cc.GroupChannel.create(this.clientName, this.loggedinIds, true, function (error, groupChannel) {
      if (error == null) {
        window.ChatCampUI.startChat(groupChannel.id);
      }
    });
    /* tslint:enable */
  }
  OnetoOne = (chatItem) => {
    const OnetoOne = [this.user_id];
    OnetoOne.push(String(chatItem.id));
    /* tslint:disable */
    window.ChatCampUi.cc.GroupChannel.create(chatItem.name, OnetoOne, true, (error, groupChannel) => {
      if (error == null) {
        // console.log('New one to one Channel has been created', groupChannel);
        window.ChatCampUI.startChat(groupChannel.id);
      }
    });
    /* tslint:enable */
  }
  openAccessDialog(userItem): void {
    const dialogRef = this.dialog.open(AccessLevelPopup, {
      width: '45vw',
      height: '70vh',
      data: userItem,
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
    });
  }
  // GET FEATIRE ACCESS AND USER ACCESS AND LOGGED IN USER LIST
  getFeatureAndUserAccessLevels = async () => {
    this.clientName = AppConstants.CLIENT_NAME;
    const clientFeatureAccessLevel: any = await this.getClientFeatureAccessLevels();
    let userAccessLevels: any;
    try {
      userAccessLevels = await this.getClientUserAccessLevels();

    } catch (error) {
      console.log(error);
    }

    try {
      const loggedInUsers: any = await this.getClientUsersList();
      console.log(loggedInUsers);
      this.loggedinUsersList = loggedInUsers;
      this.loggedinUsersList.forEach(item => {
        const userItem = <IUser>{};
        userItem._id = String(item.id);
        userItem.user_id = String(item.id);
        userItem.user_name = item.name;
        this.listOfUsers = [...this.listOfUsers, userItem];
      });
      this.chatDockUsersService.addListOfUsers(this.listOfUsers);
      this.initializeSocket();
      // this.chatDockUsersService.addChatUsers(this.listOfUsers);
    } catch (usersListError) {
      console.log(usersListError);
    }
    if (!userAccessLevels.error && !clientFeatureAccessLevel.error) {
      // tslint:disable-next-line:max-line-length
      const filteredObj = this.userAccesslevelsService.prepareExistingUserAccessLevels(clientFeatureAccessLevel.result[0], userAccessLevels.result[0].access_levels);
      this.PreparedSubfeaturesObject = filteredObj.filteredSubFeatures;
      this.PreparedfeatureObject = filteredObj.filterFeatures;
      this.userFeatureObjects = this.PreparedfeatureObject.services[0];
      this.userFeaturesNames = Object.keys(this.PreparedfeatureObject.services[0]);
      const activeRouterToken = localStorage.getItem('activeRouterToken');
      // tslint:disable-next-line:max-line-length
      if (activeRouterToken && activeRouterToken.length > 10 && BASE_ROUTER_CONFIG[localStorage.getItem('activeRouterId')].token === activeRouterToken) {
        this.router.navigate(['admin/' + localStorage.getItem('activeRouterToken')]);
      }
      this.spinnerService.hide();
    } else {
      this.spinnerService.hide();
      console.log('No proper access permisssions');
    }
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

  // page navigations
  navigatePage = (router) => {
    console.log(this.router.config);
    if (BASE_ROUTER_CONFIG[`F_${router.feature_id}`].token === router.feature_route) {
      this.router.navigate(['admin/' + router.feature_route]);
      localStorage.setItem('activeRouterToken', router.feature_route);
      localStorage.setItem('activeRouterId', `F_${router.feature_id}`);
    } else {
      this.router.navigate(['admin/']);
    }
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
  navigateSubFeature = (item) => {
    if (BASE_ROUTER_CONFIG[`F_${item.feature_id}_${item.subfeature_id}`].token === item.subfeature_route) {
      this.router.navigate(['admin/' + item.subfeature_route]);
      localStorage.setItem('activeRouterToken', item.subfeature_route);
      localStorage.setItem('activeRouterId', `F_${item.feature_id}_${item.subfeature_id}`);
    } else {
      this.router.navigate(['admin/']);
    }
  }

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
  /*Get clicked user id for custom chat*/
  onChatUserClick = (item: IUser) => {
    const checkUserLength = this.chatActiveUser.some(chatUser => chatUser.user_id === item.user_id);
    if (checkUserLength) {
      return;
    } else {
      this.chatActiveUser = [...this.chatActiveUser, item];
      this.chatDockUsersService.addChatUser(item);
    }
  }
  // INITIALIZE THE SOCKET HERE
  initializeSocket = async () => {
    const socketConnection = await this.socketService.initSocket();
    this.listenAllTheSocketServices();
  }
  // LISTEN ALL THE SERVICES
  listenAllTheSocketServices = () => {
    this.listenSocketConnectionError();
    this.listenerToGetLoggedInUsersList();
  }
  // SOCKET LISTENER FOR SOCKET CONNECTION ERRORS
  listenSocketConnectionError = () => {
    const SocketConnectionError = this.socketService.listenSocketConnectionError().subscribe(
      succResp => {
        // this.socketService.initSocket();
      }, errResp => {
        // this.socketService.initSocket();
      }
    );
  }
  // SOCKET LISTENER FOR GETTING LOGGEDIN USERS LIST
  listenerToGetLoggedInUsersList = () => {
    if (this.loggedinUserObject && this.loggedinUserObject._id) {
      this.socketService.loginSuccessEventEmit(this.loggedinUserObject);
      const loginUsersSubscriber: Subscription = this.socketService.listenLoggedUsersListener().subscribe(
        (succResp: IUserSocketResponseObject) => {
          this.isSocketConnected = true;
          this.chatDockUsersService.addLoggedinUser(this.loggedinUserObject);
          console.log('listener', succResp);
          this.listOfUsers.forEach((e1, e1_index) => {
            let sockect_key = '';
            const isUserLoggedin = succResp.logged_in_users.some((e2_item) => {
              if (e2_item.user_id === String(e1.user_id)) {
                sockect_key = e2_item.socket_key;
              }
              if (this.loggedinUserObject.user_id === e2_item.user_id) {
                this.loggedinUserObject.socket_key = e2_item.socket_key;
              }
              return e2_item.user_id === String(e1.user_id);
            });
            if (isUserLoggedin) {
              this.listOfUsers[e1_index].is_loggedin = true;
              this.listOfUsers[e1_index].socket_key = sockect_key;
            } else {
              this.listOfUsers[e1_index].is_loggedin = false;
              this.listOfUsers[e1_index].socket_key = '';
            }
          });
        },
        errResp => {
          console.log(errResp);
        }
      );
    } else {
      console.log('No Users found');
    }
  }
}
