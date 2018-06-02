import { Component, OnInit, Inject } from '@angular/core';
import { FacebookService, InitParams, LoginResponse, LoginOptions } from 'ngx-facebook';
import { FBService } from '../service/fb.service';
import * as _ from 'underscore';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
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


@Component({
  selector: 'app-root',
  templateUrl: './social-management.component.html',
  styleUrls: ['./social-management.component.scss']
})
export class SocialManagementComponent implements OnInit {
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
  constructor(public dialog: MatDialog, private fb: FacebookService, private formBuilder: FormBuilder,
    private fbService: FBService, private router: Router,
    private spinnerService: Ng4LoadingSpinnerService, public adminComponent: AdminComponent,
    private twitterService: TwitterServiceService,
    private twitterUserService: TwitterUserService,
    private fbCMPCommunicationService: FacebookComponentCommunicationService,
    private httpClient: HttpClient,
  ) {
    this.fbResponseData = <IFBFeedArray>{};
    this.fbResponseDataItems = [];
    fbService.FBInit();
    this.fbLogin();
    this.tab_index = 0;
  }
  ngOnInit(): void {
    this.getTwitterUserProfiles();
    this.loggedInUserAccountsArray = [];
  }

  public tabChanged(event: MatTabChangeEvent) {

    this.tab_index = event.index;

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
        this.fbCMPCommunicationService.TwitterSocialComposedPostAnnounce(composedPostData);
        // this.uploadFBPhotosToOurServer(composedPostData);
      }
      this.highLighted = 'hide-class';
    });
  }
  // THIS FUNCTION IS USED FOR PREPARE THE STREAMS OBJECT TO SHOW IN COMPOSE MESSAGE DIALOG.
  prepareStreamsDataForComposeMessageDialog = (loggedInUserAccountsArray) => {
    let composeMessagePopUpInputArrayData: IUserAccountPages[];
    composeMessagePopUpInputArrayData = [];
    let profileData: IUserAccountPages;
    let fbAccounts: IUserAccountPages;
    // let twitterData: IUserAccountPages;
    let fbaccounts = [];
    _.each(loggedInUserAccountsArray, (item: ILoggedInUsersAccounts, index) => {
      profileData = <IUserAccountPages>{};
      // composeMessagePopUpInputObject.id = index;
      profileData.access_token = item.access_token;
      profileData.name = item.name;
      profileData.id = item.id;
      profileData.social_id = item.id;
      fbaccounts = item.accounts;
      profileData.social_platform = item.social_platform;
      composeMessagePopUpInputArrayData.push(profileData);
    });
    _.each(fbaccounts, (account) => {
      fbAccounts = <IUserAccountPages>{};
      fbAccounts.access_token = account.access_token;
      fbAccounts.name = account.name;
      fbAccounts.id = account.id;
      fbAccounts.social_id = account.id;
      fbAccounts.social_platform = 'facebook';
      composeMessagePopUpInputArrayData.push(fbAccounts);
    });
    return composeMessagePopUpInputArrayData;
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
    this.twitterService.getTwitterUserProfiles(headers)
      .subscribe(
        result => {
          if (result.data && result.data.length > 0) {
            this.prepareLoggedInUserAccountDetails('twitter', result);
          }
          this.twitterUserService.addUser(result);
        },
        error => {
          console.log(error);
        }
      );
  }
  addSocialStreem = () => {
    this.fbCMPCommunicationService.socialaddSocialStreamAnnounceCall(this.loggedInUserAccountsArray);
  }
  // THE FOLLOWING CODE IS FOR FACEBOOK FUNCTIONALITY

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
        this.getFBUserAccounts(this.FbLongLivedToken);
      })
      .catch((err) => {
        console.log(err);
      });
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
        loggedInUserAccountsObject.id = item.id_str;
        loggedInUserAccountsObject.name = item.screen_name;
        loggedInUserAccountsObject.streams = streamsArray;
        loggedInUserAccountsObject.accounts = [];
        loggedInUserAccountsObject.order = '2';
        loggedInUserAccountsObject.social_platform = 'twitter';
        this.loggedInUserAccountsArray.push(loggedInUserAccountsObject);
      });
    } else {
      loggedInUserAccountsObject.access_token = token;
      loggedInUserAccountsObject.id = accountResp.id;
      loggedInUserAccountsObject.name = accountResp.name;
      loggedInUserAccountsObject.streams = streamsArray;
      loggedInUserAccountsObject.accounts = accountResp.accounts.data;
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

