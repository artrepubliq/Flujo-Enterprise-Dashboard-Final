import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AppConstants } from '../app.constants';
import {
  ITwitterresponse,
  ISocialKeysObject,
  ISocialKeysTableData,
  ITwitterTimelineObject,
  ITwitTimeLineObject
} from '../model/twitter/twitter.model';
import { ICommonInterface } from '../model/commonInterface.model';
import { TwitterServiceService } from '../service/twitter-service.service';
@Component({
  selector: 'app-twitter',
  templateUrl: './twitter.component.html',
  styleUrls: ['./twitter.component.scss']
})
export class TwitterComponent implements OnInit {

  public retweets: string;
  public mentions: string;
  public tweets: string;
  public timeline: string;
  public config: any;
  public showSignIn: boolean;
  public twitHomeTimeLine: ITwitterTimelineObject;
  public twitUserTimeLine: ITwitterTimelineObject;
  public twitMentionsTimeLine: ITwitterTimelineObject;
  public twitRetweets: ITwitterTimelineObject;

  public twitter_social_keys: ISocialKeysObject;
  public twitter_social_keys_object: ISocialKeysTableData[];
  public twitterUserLogin: string;
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private twitterService: TwitterServiceService
  ) { }
  public status: string;

  ngOnInit() {

    this.getTimeLines();
  }
  /*
   * this is the function when a user tries to log in
   * for the first time(If no tokens are available)
   * with the client id
   */
  public signInTwitter(): void {
    this.httpClient.get<ITwitterresponse>(AppConstants.EXPRESS_URL + 'oauth_token/' + AppConstants.CLIENT_ID)
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
      token_expiry_date: localStorage.getItem('token_expiry_date')
    };
    const headers = new HttpHeaders(headersObject);
    this.twitterService.getTimeLines(headers)
      .subscribe(
        result => {
          if (result.error === false) {
            this.timeline = 'Timeline';
            this.tweets = 'Tweets';
            this.mentions = 'Mentions';
            this.retweets = 'Retweets';
            this.twitHomeTimeLine = result.data[0];
            this.twitUserTimeLine = result.data[1];
            this.twitMentionsTimeLine = result.data[2];
            this.twitRetweets = result.data[3];
          } else {
            this.showSignIn = true;
            console.log(result.data);
          }
        },
        error => {
          console.log(error);
        });
  }

}
