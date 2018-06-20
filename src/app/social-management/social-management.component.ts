import { Component, OnInit, Inject } from '@angular/core';
import { FacebookService, InitParams, LoginResponse, LoginOptions } from 'ngx-facebook';
import { FBService } from '../service/fb.service';
import * as _ from 'underscore';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ParamMap } from '@angular/router';
import { AdminComponent } from '../admin/admin.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatTabChangeEvent } from '@angular/material';
import { ThemePalette, MatDatepickerInputEvent } from '@angular/material';
import * as moment from 'moment';
import { MessageCompose } from '../dialogs/social-compose/social-compose-message';
import { TwitterServiceService } from '../service/twitter-service.service';
import { ITwitterUserProfile, ITwitUser } from '../model/twitter/twitter.model';
import { TwitterUserService } from '../service/twitter-user.service';
import { IStreamDetails, ILoggedInUsersAccounts, IStreamComposeData, IUserAccountPages } from '../model/social-common.model';
import { FacebookComponentCommunicationService } from '../service/social-comp-int.service';
import { AppConstants } from '../app.constants';
import { IMyAccounts, IFBPages, IPaginigCursors, IFBFeedArray } from '../model/facebook.model';
import { ICommonInterface } from '../model/commonInterface.model';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './social-management.component.html',
  styleUrls: ['./social-management.component.scss']
})
export class SocialManagementComponent implements OnInit {
  doLoginConfirmed: any;
  FbLongLivedToken: any;
  userName: string;
  userAccountId: string;
  loggedInUserAccountsArray: ILoggedInUsersAccounts[];
  FBUserAccountsArray: IFBPages[];
  filteredUserAccessData: any;
  userAccessLevelObject: any;
  fbNextPage: IPaginigCursors;
  fbResponseData: IFBFeedArray;
  fbResponseDataItems: Array<IFBFeedArray>;
  getFBFeerUrl: string;
  isFbLogedin = false;
  isShowTwitter = false;
  access_token: any;
  config: any;
  highLighted = '';
  public tab_index: number;
  selectedIndex: any;
  showProgressBarValue = 0;
  constructor(public dialog: MatDialog, private fb: FacebookService, private formBuilder: FormBuilder,
    private fbService: FBService, private router: Router,
    private spinnerService: Ng4LoadingSpinnerService, public adminComponent: AdminComponent,
    private twitterService: TwitterServiceService,
    private twitterUserService: TwitterUserService,
    private fbCMPCommunicationService: FacebookComponentCommunicationService,
    private httpClient: HttpClient,
    private route: ActivatedRoute,
  ) {
    this.doLoginConfirmed = fbCMPCommunicationService.FBLoginConfirmed$.subscribe(
      fbLogin => {
        console.log(fbLogin);
        this.fbLogin();
      });
    this.fbResponseData = <IFBFeedArray>{};
    this.fbResponseDataItems = [];
    fbService.FBInit();
    // this.fbLogin();
    this.getFacebookTokenFromOurServer();
  }
  ngOnInit(): void {
    const sub = this.route.params.subscribe(params => {
      console.log(params['id']);
      this.selectedIndex = params['id'];
      this.tab_index = this.selectedIndex;
   });
    this.getTwitterUserProfiles();
    this.loggedInUserAccountsArray = [];
  }

  public tabChanged(event: MatTabChangeEvent) {

    this.tab_index = event.index;

  }
  // THIS FUNCTION IS USED TO ADD SOCIAL NETWOK.
  addSocialNetwork = () => {
    this.router.navigate(['admin/social_login']);
  }
  openmessageComposeDialog(): void {
    let composeMessagePopUpInputArrayData: IUserAccountPages[];
    composeMessagePopUpInputArrayData = this.prepareStreamsDataForComposeMessageDialog(this.loggedInUserAccountsArray);
    console.log(composeMessagePopUpInputArrayData);
    const dialogRef = this.dialog.open(MessageCompose, {
      panelClass: 'app-full-bleed-dialog',
      width: '45vw',
      height: '61vh',
      data: composeMessagePopUpInputArrayData,
    });
    this.highLighted = 'show-class';
    dialogRef.afterClosed().subscribe(composedPostData => {
      if (composedPostData) {
        if (composedPostData.composedMessage.media.length > 0) {
          this.uploadFBPhotosToOurServer(composedPostData);
        } else {
          this.fbCMPCommunicationService.FBSocialComposedPostAnnounce(composedPostData);
        }
        this.fbCMPCommunicationService.TwitterSocialComposedPostAnnounce(composedPostData);
      }
      this.highLighted = 'hide-class';
    });
  }
  // THIS FUNCTION IS USED FOR PREPARE THE STREAMS OBJECT TO SHOW IN COMPOSE MESSAGE DIALOG.
  prepareStreamsDataForComposeMessageDialog = (loggedInUserAccountsArray) => {
    let composeMessagePopUpInputArrayData: IUserAccountPages[];
    composeMessagePopUpInputArrayData = [];
    let profileData: IUserAccountPages;
    let fbUserAccounts: IUserAccountPages[];
    fbUserAccounts = [];
    // let twitterData: IUserAccountPages;
    _.each(loggedInUserAccountsArray, (item: ILoggedInUsersAccounts, index) => {
      profileData = <IUserAccountPages>{};
      // composeMessagePopUpInputObject.id = index;
      profileData.access_token = item.access_token;
      profileData.name = item.name;
      profileData.id = item.social_id;
      profileData.social_id = item.social_id;
      if (item.accounts && item.accounts.length > 0) {
        fbUserAccounts = this.prepareFacebookUserAccountsObject(item.accounts);
      }
      profileData.social_platform = item.social_platform;
      composeMessagePopUpInputArrayData.push(profileData);
    });
    composeMessagePopUpInputArrayData = [ ...composeMessagePopUpInputArrayData, ...fbUserAccounts];
    return composeMessagePopUpInputArrayData;
    // if (fbaccounts && fbaccounts.length > 0) {
    //   _.each(fbaccounts, (account) => {
    //     fbAccounts = <IUserAccountPages>{};
    //     fbAccounts.access_token = account.access_token;
    //     fbAccounts.name = account.name;
    //     fbAccounts.id = account.id;
    //     fbAccounts.social_id = account.id;
    //     fbAccounts.social_platform = 'facebook';
    //     composeMessagePopUpInputArrayData.push(fbAccounts);
    //   });
    //   return composeMessagePopUpInputArrayData;
    // } else {
    //   return composeMessagePopUpInputArrayData;
    // }
  }
// PREPARE FACEBOOK USER ACCOUNTS OBJECT
prepareFacebookUserAccountsObject = (accounts) => {
  let fbAccounts: IUserAccountPages;
  const  fbAccountsData = [];
  _.each(accounts, (account) => {
    fbAccounts = <IUserAccountPages>{};
    fbAccounts.access_token = account.access_token;
    fbAccounts.name = account.name;
    fbAccounts.id = account.id;
    fbAccounts.social_id = account.id;
    fbAccounts.social_platform = 'facebook';
    fbAccountsData.push(fbAccounts);
  });
  return fbAccountsData;
}
  /**
   * this is to get twittter user profile data.
   */

  public getTwitterUserProfiles(): void {

    const headersObject = {
      twitter_access_token: localStorage.getItem('twitter_access_token'),
      token_expiry_date: localStorage.getItem('token_expiry_date'),
      client_id: AppConstants.CLIENT_ID
    };

    const headers = new HttpHeaders(headersObject);
    this.twitterService.getTwitterUserProfiles(headers, undefined)
      .subscribe(
        result => {
          this.showProgressBarValue = 100;
          if (result.data && result.data.length > 0) {
            this.prepareLoggedInUserAccountDetails('twitter', result);
          }
          this.twitterUserService.addUser(result);
        },
        error => {
          this.showProgressBarValue = 100;
          console.log(error);
        }
      );
  }
  addSocialStreem = () => {
    this.fbCMPCommunicationService.socialaddSocialStreamAnnounceCall(this.loggedInUserAccountsArray);
  }

  fbLogin = () => {
    // login with options
    const options: LoginOptions = {
      scope: 'public_profile,user_friends,email,user_posts, pages_show_list , manage_pages, publish_pages',
      return_scopes: true,
      enable_profile_selector: true
    };
    this.fb.login(options)
      .then((response: LoginResponse) => {
        this.getExtendedAccessToken(response);
      })
      .catch((e: Error) => {
        console.log(e);
      });
  }
  // THIS FUNCTION IS USED TO GET THE EXTENDED ACCESSTOKEN FROM THE FACEBOOK
  getExtendedAccessToken = (response) => {
    // tslint:disable-next-line:max-line-length
    this.fb.api('https://graph.facebook.com/v3.0/oauth/access_token?grant_type=fb_exchange_token&client_id=208023236649331&client_secret=294c39db380eab8dbe3ed39125d60eab&fb_exchange_token=' + response.authResponse.accessToken, 'get')
      .then((resp) => {
        this.FbLongLivedToken = resp.access_token;
        this.saveFacebookAccessTokenIntoOurServer(resp);
        this.getFBUserAccounts(this.FbLongLivedToken);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  // THIS FUNCTION IS USED TO SAVE THE FB ACCESS TOKEN INTO OUR SERVER
  saveFacebookAccessTokenIntoOurServer = (tokenDetails) => {
    let postData: {'client_id': string, 'social_appname': string, 'social_keys': any};
    postData = <any>{};
    postData.client_id = AppConstants.CLIENT_ID;
    postData.social_appname = 'facebook';
    postData.social_keys = tokenDetails;
    this.httpClient.post('http://www.flujo.in/dashboard/flujo_staging/v1/flujo_client_postsocialtokens', postData).subscribe(
      saveResp => {
        console.log(saveResp);
      },
      error => {
        console.log(error);
      }
    );
  }

  // THIS FUNCTION IS USED TO GET THE FACEBOOK TOKENS FROM OUR SERVER.
  getFacebookTokenFromOurServer = () => {
    // tslint:disable-next-line:max-line-length
    this.httpClient.get<ICommonInterface>('http://www.flujo.in/dashboard/flujo_staging/v1/flujo_client_getsocialtokens/' + AppConstants.CLIENT_ID)
    .subscribe(
      respData => {
        this.showProgressBarValue = 100;
        const currentDate = moment();
        if (respData.access_token && respData.custom_status_code === 100 && !respData.error ) {
          respData.result.forEach((iteratee) => {
            // tslint:disable-next-line:max-line-length
            if (iteratee.social_appname === 'facebook' &&  (moment(currentDate).valueOf()) < (moment(moment(moment.unix(iteratee.submitted_at)).add(3, 'months')).valueOf())) {
              this.FbLongLivedToken = iteratee.social_keys ? iteratee.social_keys.access_token : false ;
              this.getFBUserAccounts(this.FbLongLivedToken);
            }
          });
          if (!this.FbLongLivedToken) {
            this.fbLogin();
          }
        }
        console.log(respData);
      },
      errData => {
        this.showProgressBarValue = 100;
        console.log(errData);
      }
    );
  }
  // THIS FUNCTION IS USED FOR GET ALL THE ACCOUNTS OF LOGGED IN USER
  getFBUserAccounts = (access_token) => {
      this.fb.api('https://graph.facebook.com/v3.0/me?fields=accounts,id,name&access_token=' + access_token, 'get')
        .then((accountResp: IMyAccounts) => {
          this.prepareLoggedInUserAccountDetails(access_token, accountResp);
          this.FBUserAccountsArray = accountResp.accounts.data;
          this.userName = accountResp.name;
          this.userAccountId = accountResp.id;

        })
        .catch((e: any) => {
          console.log(e);
        });
  }
  prepareLoggedInUserAccountDetails = (token: any, accountResp: any) => {
    const streamsArray = ['My Posts', 'Home TimeLine', 'Mentions'];
    let loggedInUserAccountsObject: ILoggedInUsersAccounts;
    loggedInUserAccountsObject = <ILoggedInUsersAccounts>{};
    if (token === 'twitter') {
      accountResp.data.map((item: ITwitterUserProfile, index) => {
        loggedInUserAccountsObject.access_token = '';
        loggedInUserAccountsObject.social_id = item.id_str;
        loggedInUserAccountsObject.name = item.screen_name;
        loggedInUserAccountsObject.streams = streamsArray;
        loggedInUserAccountsObject.accounts = [];
        loggedInUserAccountsObject.order = '2';
        loggedInUserAccountsObject.social_platform = 'twitter';
        this.loggedInUserAccountsArray.push(loggedInUserAccountsObject);
      });
    } else {
      loggedInUserAccountsObject.access_token = token;
      loggedInUserAccountsObject.social_id = accountResp.id;
      loggedInUserAccountsObject.name = accountResp.name;
      loggedInUserAccountsObject.streams = streamsArray;
      loggedInUserAccountsObject.accounts = this.prepareFacebookUserAccountsObject(accountResp.accounts.data);
      loggedInUserAccountsObject.order = '1';
      loggedInUserAccountsObject.social_platform = 'facebook';
      this.loggedInUserAccountsArray.push(loggedInUserAccountsObject);
    }
    return this.loggedInUserAccountsArray;
  }
  // THIS FUNCTION IS USED TO UPLOAD THE PHOTOS TO THE SERVER AND GET THE URL PATH OF THAT IMAGE
  uploadFBPhotosToOurServer = (composedPostData: IStreamComposeData) => {
    const uploadPhotosformData = new FormData();
    composedPostData.composedMessage.media.map(file => {
      uploadPhotosformData.append('images[]', file);
      });
      uploadPhotosformData.append('client_id', AppConstants.CLIENT_ID);
    // tslint:disable-next-line:max-line-length
    this.httpClient.post<ICommonInterface>('http://www.flujo.in/dashboard/flujo_staging/v1/flujo_client_postsocialimageupload', uploadPhotosformData).subscribe(
       successresp => {
         console.log(successresp);
        if (successresp.access_token && successresp.custom_status_code === 100 && !successresp.error ) {
        composedPostData.composedMessage.media = successresp.result;
        this.fbCMPCommunicationService.FBSocialComposedPostAnnounce(composedPostData);
        }
      }, errorrsp => {
        console.log(errorrsp);
      }
    );
  }
}
