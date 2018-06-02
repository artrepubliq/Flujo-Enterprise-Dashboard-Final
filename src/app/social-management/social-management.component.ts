import { Component, OnInit, Inject } from '@angular/core';
import { FacebookService, InitParams, LoginResponse, LoginOptions } from 'ngx-facebook';
import { FBService } from '../service/fb.service';
import { IFBFeedResponse, IFBFeedArray, IPaginigCursors } from '../model/fb-feed.model';
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
import { IMyAccounts, IFBPages } from '../model/facebook.model';
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
  public twitUserInfo: ITwitUser;
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
    composeMessagePopUpInputArrayData = this.prepareStreamsDataForComposeMessageDialog(this.loggedInUserAccountsArray, this.twitUserInfo);
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
        this.uploadFBPhotosToOurServer(composedPostData);
      }
      this.highLighted = 'hide-class';
    });
  }

  prepareStreamsDataForComposeMessageDialog = (loggedInUserAccountsArray, twitUserInfo) => {
    let composeMessagePopUpInputArrayData: IUserAccountPages[];
    composeMessagePopUpInputArrayData = [];
    let facebookObject: IUserAccountPages;
    let twitterData: IUserAccountPages;
    const social_platform = [];
    _.each(loggedInUserAccountsArray, (item: ILoggedInUsersAccounts, index) => {
      facebookObject = <IUserAccountPages>{};
      // composeMessagePopUpInputObject.id = index;
      facebookObject.access_token = item.access_token;
      facebookObject.name = item.name;
      facebookObject.id = item.id;
      facebookObject.social_id = item.id;
      facebookObject.social_platform = 'facebook';
      _.each(item.accounts, (account) => {
        facebookObject = <IUserAccountPages>{};
        facebookObject.access_token = item.access_token;
        facebookObject.name = item.name;
        facebookObject.id = item.id;
        facebookObject.social_id = item.id;
        facebookObject.social_platform = 'facebook';
        composeMessagePopUpInputArrayData.push(facebookObject);
      });
      composeMessagePopUpInputArrayData.push(facebookObject);
    });

    if (twitUserInfo.data && this.twitUserInfo.data.length > 0) {
      this.twitUserInfo.data.map((item: ITwitterUserProfile, index) => {
        twitterData = <IUserAccountPages>{};
        twitterData.id = String(index);
        twitterData.access_token = '';
        twitterData.name = item.screen_name;
        twitterData.social_id = item.id_str;
        composeMessagePopUpInputArrayData.push(twitterData);
      });
    }
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
          this.twitUserInfo = result;
          this.twitUserInfo.type = 'twitter';
          this.twitterUserService.addUser(this.twitUserInfo);
        },
        error => {
          console.log(error);
        }
      );
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
  prepareLoggedInUserAccountDetails = (token: any, accountResp: IMyAccounts) => {
    const streamsArray = ['My Posts', 'Home TimeLine', 'Mentions'];
    let loggedInUserAccountsObject: ILoggedInUsersAccounts;
    loggedInUserAccountsObject = <ILoggedInUsersAccounts>{};
    loggedInUserAccountsObject.access_token = token;
    loggedInUserAccountsObject.id = accountResp.id;
    loggedInUserAccountsObject.name = accountResp.name;
    loggedInUserAccountsObject.streams = streamsArray;
    loggedInUserAccountsObject.accounts = accountResp.accounts.data;
    loggedInUserAccountsObject.order = '1';
    loggedInUserAccountsObject.social_platform = 'facebook';
    this.loggedInUserAccountsArray.push(loggedInUserAccountsObject);
    return this.loggedInUserAccountsArray;
  }
  // THIS FUNCTION IS USED TO UPLOAD THE PHOTOS TO THE SERVER AND GET THE URL PATH OF THAT IMAGE
  uploadFBPhotosToOurServer = (composedPostData: IStreamComposeData) => {
    console.log(composedPostData);
    // tslint:disable-next-line:max-line-length
    this.httpClient.post<ICommonInterface>('http://www.flujo.in/dashboard/flujo_staging/flujo_client_postsocialimageupload', composedPostData.composedMessage.media).subscribe(
       successresp => {
        if (successresp.access_token && successresp.custom_status_code === 100 && !successresp.error ) {
        composedPostData.composedMessage.media = successresp.result;
        this.fbCMPCommunicationService.fbComposedPostAnnounce(composedPostData);
        }

      }, errorrsp => {
        console.log(errorrsp);
      }
    );
  }
}

