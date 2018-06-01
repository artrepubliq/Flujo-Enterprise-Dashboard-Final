import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AppConstants } from '../app.constants';
import {
  ITwitterresponse,
  ISocialKeysObject,
  ISocialKeysTableData,
  ITwitterTimelineObject,
  ITwitTimeLineObject,
  ITwitUser
} from '../model/twitter/twitter.model';
import { ICommonInterface } from '../model/commonInterface.model';
import { TwitterServiceService } from '../service/twitter-service.service';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { Observable } from 'rxjs/Observable';
import { TwitterUserService } from '../service/twitter-user.service';
import { FacebookComponentCommunicationService } from '../service/social-comp-int.service';
import { IStreamComposeData, IComposePost } from '../model/social-common.model';
@Component({
  selector: 'app-twitter',
  templateUrl: './twitter.component.html',
  styleUrls: ['./twitter.component.scss']
})
export class TwitterComponent implements OnInit, OnDestroy {

  subscription: any;
  public twitterUser: ITwitUser;
  // private ngUnSubScribe = new Subject();
  public config: any;
  public showSignIn: boolean;
  // public previousTweetTimeline: ITwitterTimelineObject[];
  public twitHomeTimeLine: ITwitterTimelineObject[];
  public twitUserTimeLine: ITwitterTimelineObject[];
  public twitMentionsTimeLine: ITwitterTimelineObject[];
  public twitRetweets: ITwitterTimelineObject[];
  public twitter_social_keys: ISocialKeysObject;
  public twitter_social_keys_object: ISocialKeysTableData[];
  public twitterUserLogin: string;
  public tweetPostData: IStreamComposeData;
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private twitterService: TwitterServiceService,
    private twitterUserService: TwitterUserService,
    private fbCMPCommunicationService: FacebookComponentCommunicationService
  ) {
    this.subscription = this.fbCMPCommunicationService.FBComposedPost$.subscribe(
      result => {
        // console.log(result);
        if (result.streamDetails.length > 0 && result.streamDetails[0].social_platform === 'twitter') {
          if (result.composedMessage.media && result.composedMessage.media.length > 0) {
            this.postTweetWithMedia(result.composedMessage);
          } else {
            this.postATweet(result.composedMessage);
          }
        }
      });
  }
  public status: string;

  ngOnInit() {
    if (this.twitHomeTimeLine === undefined) {
      this.getTimeLines();
    }
    // this.twitterUser = this.twitterUserService.getTwitterData;

  }
  /*
   * this is the function when a user tries to log in
   * for the first time(If no tokens are available)
   * with the client id
   */
  public signInTwitter(): void {

    const headersObject = {
      twitter_access_token: localStorage.getItem('twitter_access_token'),
      token_expiry_date: localStorage.getItem('token_expiry_date')
    };

    const headers = new HttpHeaders(headersObject);

    this.httpClient.get<ITwitterresponse>(AppConstants.EXPRESS_URL + 'oauth_token/' + AppConstants.CLIENT_ID,
      { headers: headers })
      .subscribe(
        result => {
          console.log(result);
          if (result.error === false && result.token_data.oauth_callback_confirmed === 'true') {
            this.twitterUserLogin = AppConstants.TWITTER_API_URL + '/oauth/authenticate' +
              '?oauth_token=' + result.token_data.oauth_token;
          }
        },
        error => {
          console.log(error);
        });
  }

  /**
   * this is to get existing user auth_tokens from database.
   */
  public getUserTokens(): void {
    this.httpClient.get<ICommonInterface>(AppConstants.API_URL + 'flujo_client_getsocialtokens' + '/' + AppConstants.CLIENT_ID)
      .subscribe(
        response => {
          // this.twitter_social_keys_object = response.result.filter(object => object.social_appname === 'twitter');
          // this.twitter_social_keys = this.twitter_social_keys_object[0].social_keys;
          console.log(response);
        },
        error => {
          console.log(error);
        }
      );
  }
  /**
   * this is to get time line from twitter service
   */
  public getTimeLines(): void {
    this.showSignIn = false;
    const headersObject = {
      twitter_access_token: localStorage.getItem('twitter_access_token'),
      token_expiry_date: localStorage.getItem('token_expiry_date'),
      client_id: AppConstants.CLIENT_ID
    };
    const headers = new HttpHeaders(headersObject);
    this.twitterService.getTimeLines(headers)
      .subscribe(
        result => {
          if (result.error === false && result.data) {
            this.twitHomeTimeLine = result.data[0];
            this.twitUserTimeLine = result.data[1];
            this.twitMentionsTimeLine = result.data[2];
            this.twitRetweets = result.data[3];
            console.log(this.twitHomeTimeLine);
          } else {
            this.showSignIn = true;
            console.log(result.data);
          }
        },
        error => {
          console.log(error);
        });
  }

  /** this is an event triggered when scrolled to end
   *
  */

  public homeTimeLineScrollEvent(event): void {
    const last_index = this.twitHomeTimeLine.length - 1;
    console.log(this.twitHomeTimeLine[last_index].id);
    this.twitterService.getOldHomeTimeline(this.twitHomeTimeLine[last_index].id)
      .subscribe(
        result => {
          console.log(result.data);
          if (!result.error) {
            this.twitHomeTimeLine = [...this.twitHomeTimeLine, ...result.data];
          }
          console.log(this.twitHomeTimeLine);
          console.log(this.twitHomeTimeLine);
        },
        error => {
          console.log(error);
        });
  }
  /**
   * this is to post the status on twitter
   * @param tweetData has the info of message or status to be posted
   */
  public postATweet(tweetData: IComposePost): void {
    console.log(tweetData);
    if (tweetData.from_date || tweetData.to_date) {
      this.twitterService.postScheduleTweet(tweetData)
        .subscribe(
          result => {
            console.log(result);
          },
          error => {
            console.log(error);
          }
        );
    } else {
      this.twitterService.postStatusOnTwitter(tweetData)
        .subscribe(
          result => {
            console.log(result);
          },
          error => {
            console.log(error);
          }
        );
    }
  }
  /**
   *
   * @param tweetData this contains tweet information with media;
   */
  public postTweetWithMedia(tweetData: IComposePost): void {
    console.log(tweetData);
    const formData = new FormData();
    formData.append('message', tweetData.message);
    tweetData.media.map(item => {
      formData.append('media[]', item);
    });
    this.twitterService.postTweetMedia(formData)
      .subscribe(
        result => {
          console.log(result);
        },
        error => {
          console.log(error);
        }
      );
  }

  public ngOnDestroy(): void {
    // this.ngUnSubScribe.next();
    // this.ngUnSubScribe.complete();
  }

}
