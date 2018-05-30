import { Component, OnInit, Inject } from '@angular/core';
import { FacebookService, InitParams, LoginResponse, LoginOptions } from 'ngx-facebook';
import { FBService } from '../service/fb.service';
import { IFBFeedResponse, IFBFeedArray, IPaginigCursors } from '../model/fb-feed.model';
import * as _ from 'underscore';
import { Router } from '@angular/router';
import { AdminComponent } from '../admin/admin.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatTabChangeEvent } from '@angular/material';
import { ThemePalette, MatDatepickerInputEvent } from '@angular/material';
import * as moment from 'moment';
import { MessageCompose } from '../dialogs/social-compose/social-compose-message';
import { HttpHeaders } from '@angular/common/http';
import { TwitterServiceService } from '../service/twitter-service.service';
import { ITwitterUserProfile, ITwitUser } from '../model/twitter/twitter.model';
import { TwitterUserService } from '../service/twitter-user.service';
import { IStreamDetails } from '../model/social-common.model';
import { FacebookComponentCommunicationService } from '../service/social-comp-int.service';
import { AppConstants } from '../app.constants';


@Component({
  selector: 'app-root',
  templateUrl: './social-management.component.html',
  styleUrls: ['./social-management.component.scss']
})
export class SocialManagementComponent implements OnInit {
  // FBUserAccountsArray: IFBpages[];
  // public social_users_info: { twitter: ITwitterUserProfile[], facebook: any };
  public twitUserInfo: ITwitUser;
  test: FormGroup;
  test1: string;
  test2: string;
  test3: string;
  test4: string;
  filteredUserAccessData: any;
  userAccessLevelObject: any;
  postis = 4;
  fbNextPage: IPaginigCursors;
  fbResponseData: IFBFeedArray;
  fbResponseDataItems: Array<IFBFeedArray>;
  // tslint:disable-next-line:max-line-length
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
    private fbCMPCommunicationService: FacebookComponentCommunicationService
  ) {
    this.fbResponseData = <IFBFeedArray>{};
    this.fbResponseDataItems = [];
    fbService.FBInit();

    this.test = this.formBuilder.group({
      'test1': ['', Validators.required],
      'test2': ['', Validators.required],
      'test3': ['', Validators.required],
      'test4': ['', Validators.required],
    });

    this.tab_index = 0;
  }
  ngOnInit(): void {
    setTimeout(function () {
      this.test.controls['test1'].setValue('test1');
      this.test.controls['test2'].setValue('test2');
      this.test.controls['test3'].setValue('test3');
      this.test.controls['test4'].setValue('test4');
    }.bind(this), 3000);

    this.getTwitterUserProfiles();

  }

  public tabChanged(event: MatTabChangeEvent) {

    this.tab_index = event.index;

  }

  openmessageComposeDialog(): void {
    let composeMessagePopUpInputArrayData: IStreamDetails[];
    composeMessagePopUpInputArrayData = [];
    let composeMessagePopUpInputObject: IStreamDetails;
    // _.each(this.FBUserAccountsArray, (item: IFBPages, index) => {
    //   composeMessagePopUpInputObject = <IStreamDetails>{};
    //   composeMessagePopUpInputObject.id = index;
    //   composeMessagePopUpInputObject.access_token = item.access_token;
    //   composeMessagePopUpInputObject.screen_name = item.name;
    //   composeMessagePopUpInputObject.social_id = item.id;
    //   composeMessagePopUpInputArrayData.push(composeMessagePopUpInputObject);
    // });
    // console.log(this.twitUserInfo);
    if (this.twitUserInfo.data && this.twitUserInfo.data.length > 0) {
      this.twitUserInfo.data.map((item: ITwitterUserProfile, index) => {
        composeMessagePopUpInputObject = <IStreamDetails>{};
        composeMessagePopUpInputObject.id = index;
        composeMessagePopUpInputObject.access_token = '';
        composeMessagePopUpInputObject.social_platform = 'twitter';
        composeMessagePopUpInputObject.screen_name = item.screen_name;
        composeMessagePopUpInputObject.social_id = item.id_str;
        composeMessagePopUpInputArrayData.push(composeMessagePopUpInputObject);
      });
    }
    const dialogRef = this.dialog.open(MessageCompose, {
      panelClass: 'app-full-bleed-dialog',
      width: '45vw',
      height: '61vh',
      data: composeMessagePopUpInputArrayData,
    });
    this.highLighted = 'show-class';
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fbCMPCommunicationService.fbComposedPostAnnounce(result);
      }
      this.highLighted = 'hide-class';
    });
  }
  fbLogin = () => {
    // login with options
    const options: LoginOptions = {
      scope: 'public_profile,user_friends,email, pages_show_list , manage_pages, publish_pages',
      return_scopes: true,
      enable_profile_selector: true
    };
    this.fb.login(options)
      .then((response: LoginResponse) => {
        console.log(response);
        localStorage.setItem('access_token', response.authResponse.accessToken);
      }
      )
      .catch((e: Error) => {
        console.log(e);
      });
  }
  /* make the API call */
  getDebugToken = () => {
    // tslint:disable-next-line:max-line-length
    this.fb.api('https://graph.facebook.com/v2.12/oauth/access_token?grant_type=fb_exchange_token&client_id=149056292450936&client_secret=d9a268c797f16d10ce58c44e923488aa&fb_exchange_token=EAACHkN9c8ngBABoqnD32p6ozaGBFdDZBYN0msdi052zd0c4IcpB7IBZAAE5S3W9hBXgyItsGZBakGQ0Xoe8KyLgwGMWm2OisdQXxr6fO7s8vMpZCatz6bK8zX5Rv0QIdcKrEU0cCzbNAGHXFr6ZBBKS87eJow1kYZD', 'get').then((resp) => {
      console.log(resp);
    })
      .catch((err) => {
        console.log(err);
      });

  }

  getFBFeedFromApi(graphurl) {
    if (graphurl) {
      this.fb.api(graphurl, 'get')
        .then((res: IFBFeedResponse) => {
          console.log(res.data);
          _.each(res.data, (fbData: IFBFeedArray) => {
            this.fbResponseData = fbData;
            this.fbResponseDataItems.push(this.fbResponseData);
          });
          if (res.paging.next) {
            this.fbNextPage = res.paging.next;
          } else {
            this.fbNextPage = null;
          }
        })
        .catch((e: any) => {
          console.log(e);
        });
    }
  }

  fbLoadMore = () => {
    this.getFBFeedFromApi(this.fbNextPage);
  }

  getTwitterFeed() {
    this.isShowTwitter = true;
  }

  addPost() {

    this.fb.api('https://graph.facebook.com/v2.12/Squaretechnos1/feed',
      'post',
      {
        'message': 'This is a test message' + this.postis
      })
      .then((respo: any) => {
        this.postis = this.postis + 1;
        console.log(respo);
      })
      .catch((err: Error) => {
        console.log(err);
      });
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
}

