import { Injectable } from '@angular/core';
import { AppConstants } from '../app.constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { IComposePost } from '../model/social-common.model';
import {
  ITwitterTimelineObject,
  ITwitTimeLineObject,
  ITwitIndividualTimeLineObejct,
  ITwitterUserProfile, ITwitUser, ITStatusResponse, ITwitterUser
} from '../model/twitter/twitter.model';

@Injectable()
export class TwitterServiceService {

  public headers: HttpHeaders;
  public headersObject: { twitter_access_token: string; token_expiry_date: string; client_id: string; };
  private subject = new Subject<ITwitUser>();
  userdata$ = this.subject.asObservable();
  private twit_user: ITwitUser;
  constructor(
    private httpClient: HttpClient
  ) {
    this.headersObject = {
      twitter_access_token: localStorage.getItem('twitter_access_token'),
      token_expiry_date: localStorage.getItem('token_expiry_date'),
      client_id: AppConstants.CLIENT_ID
    };
    this.headers = new HttpHeaders(this.headersObject);
  }

  /**
   *
   * @param headers Headers we need to pass twitter feature token and expiry date
   * it returns the various timelines like user, home, mentions, retweets
   */
  public getTimeLines(headers): Observable<ITwitTimeLineObject> {
    return this.httpClient.get<ITwitTimeLineObject>
      (AppConstants.EXPRESS_URL + 'oauth_token/' + AppConstants.CLIENT_ID, { headers: headers });
  }

  /**
   *
   * @param max_id this is the tweet id we need to pass,
   * it returns recent tweets less than the max_id
   */
  public getOldHomeTimeline(max_id): Observable<ITwitIndividualTimeLineObejct> {

    return this.httpClient.get<ITwitIndividualTimeLineObejct>
      (AppConstants.EXPRESS_URL + 'timeline/' + max_id, { headers: this.headers });
  }

  /**
   *
   * @param max_id this is the tweet id we need to pass,
   * it returns recent tweets less than the max_id
   */
  public getOldUserTimeline(max_id): Observable<ITwitIndividualTimeLineObejct> {

    return this.httpClient.get<ITwitIndividualTimeLineObejct>
      (AppConstants.EXPRESS_URL + 'usertimeline/' + max_id, { headers: this.headers });
  }

  /**
   *
   * @param max_id this is the tweet id we need to pass,
   * it returns recent tweets less than the max_id
   */
  public getOldMentionsTimeline(max_id): Observable<ITwitIndividualTimeLineObejct> {

    return this.httpClient.get<ITwitIndividualTimeLineObejct>
      (AppConstants.EXPRESS_URL + 'mentionstimeline/' + max_id, { headers: this.headers });
  }

  /**
   *
   * @param max_id this is the tweet id we need to pass,
   * it returns recent tweets less than the max_id
   */
  public getOldRetweetsOfMeTimeline(max_id): Observable<ITwitIndividualTimeLineObejct> {

    return this.httpClient.get<ITwitIndividualTimeLineObejct>
      (AppConstants.EXPRESS_URL + 'retweetsofme/' + max_id, { headers: this.headers });
  }

  /**
   *
   * @param headers Headers we need to pass twitter feature token and expiry date
   * it returns the various timelines like user, home, mentions, retweets
   */
  public getTwitterUserProfiles(headers, body: { user_id: string, screen_name: string }| undefined): Observable<ITwitUser> {
    return this.httpClient.post<ITwitUser>(
      AppConstants.EXPRESS_URL + 'userprofile', body, { headers: headers }
    );
  }

  /**
   * this is a service for posting a status on twitter
   * @param status this is the status we need to post, this should be
   * an object
   */
  public postStatusOnTwitter(status: IComposePost): Observable<ITStatusResponse> {
    return this.httpClient.post<ITStatusResponse>(
      AppConstants.EXPRESS_URL + 'poststatus', status, { headers: this.headers }
    );
  }

  /**
   * this is a service to delete a tweet on twitter
   * @param tweet_id this is a tweet_id that we need to delete this must be an object
   */
  public deleteTweetOfId(tweet_id): Observable<ITStatusResponse> {
    return this.httpClient.post<ITStatusResponse>(
      AppConstants.EXPRESS_URL + 'deletetweet', tweet_id, { headers: this.headers }
    );
  }
  /**
   * this is to retweet the status or a tweet
   * @param tweet_id this is a tweet_id that we need to retweet this must be an object
   */
  public retweetOfId(tweet_id): Observable<ITStatusResponse> {
    return this.httpClient.post<ITStatusResponse>(
      AppConstants.EXPRESS_URL + 'retweet', tweet_id, { headers: this.headers }
    );
  }

  /**
   * this is to retweet the status or a tweet
   * @param tweet_id this is a tweet_id that we need to retweet this must be an object
   */
  public postFavorite(tweet_id): Observable<ITStatusResponse> {
    return this.httpClient.post<ITStatusResponse>(
      AppConstants.EXPRESS_URL + 'postfavorite', tweet_id, { headers: this.headers }
    );
  }
  /**
   * this is to retweet the status or a tweet
   * @param tweet_id this is a tweet_id that we need to retweet this must be an object
   */
  public postUndoFavorite(tweet_id): Observable<ITStatusResponse> {
    return this.httpClient.post<ITStatusResponse>(
      AppConstants.EXPRESS_URL + 'postunfavorite', tweet_id, { headers: this.headers }
    );
  }

  /**
   *
   * @param headers Headers we need to pass twitter feature token and expiry date
   * it returns the user
   */
  public getUserTimeline(): Observable<ITwitIndividualTimeLineObejct> {
    return this.httpClient.get<ITwitIndividualTimeLineObejct>
      (AppConstants.EXPRESS_URL + 'getusertimeline/' + AppConstants.CLIENT_ID, { headers: this.headers });
  }

  /**
   *
   * @param headers Headers we need to pass twitter feature token and expiry date
   * it returns the home timeline
   */
  public getHomeTimeline(): Observable<ITwitIndividualTimeLineObejct> {
    return this.httpClient.get<ITwitIndividualTimeLineObejct>
      (AppConstants.EXPRESS_URL + 'gethometimeline/' + AppConstants.CLIENT_ID, { headers: this.headers });
  }

  /**
   *
   * @param headers Headers we need to pass twitter feature token and expiry date
   * it returns the home timeline
   */
  public getMentionsTimeline(): Observable<ITwitIndividualTimeLineObejct> {
    return this.httpClient.get<ITwitIndividualTimeLineObejct>
      (AppConstants.EXPRESS_URL + 'getmentionstimeline/' + AppConstants.CLIENT_ID, { headers: this.headers });
  }

  /**
   *
   * @param headers Headers we need to pass twitter feature token and expiry date
   * it returns the home timeline
   */
  public getRetweetsTimeline(): Observable<ITwitIndividualTimeLineObejct> {
    return this.httpClient.get<ITwitIndividualTimeLineObejct>
      (AppConstants.EXPRESS_URL + 'getretweetstimeline/' + AppConstants.CLIENT_ID, { headers: this.headers });
  }
  /**
   * this is to post tweet with media
   * @param tweetMedia this has info of tweet media and status
   */
  public postTweetMedia(tweetMedia): Observable<any> {
    // tslint:disable-next-line:max-line-length
    // return this.httpClient.post<Observable<any>>('http://192.168.1.35:3000/scheduler/twitter/media', tweetMedia, { headers: this.headers });
    return this.httpClient.post<Observable<any>>(
      AppConstants.EXPRESS_URL + 'postmediastatus', tweetMedia, { headers: this.headers });
  }

  /**
   * this is to post tweet with media
   * @param tweetMedia this has info of tweet media and status
   */
  public postTweetMediaSchedule(tweetMedia): Observable<any> {
    return this.httpClient.post<Observable<any>>('http://192.168.1.35:3000/scheduler/twitter/media', tweetMedia, { headers: this.headers });
    // return this.httpClient.post<Observable<any>>(AppConstants.EXPRESS_URL + 'postmediastatus', tweetMedia, { headers: this.headers });
  }
  /**
   * this is to schedule the tweet post with media
   * @param data this takes twitter media post data
   */
  public postScheduleTweet(data): Observable<ITwitterUser> {
    return this.httpClient.post<ITwitterUser>(
      'http://192.168.1.35:3000/scheduler/twitter/', data, { headers: this.headers }
    );
  }

  public getTweetStatusById(twit_id_str): Observable<ITwitterTimelineObject> {
    return this.httpClient.get<ITwitterTimelineObject>(
      AppConstants.EXPRESS_URL + 'gettweetstatusbytwtid/' + twit_id_str, { headers: this.headers }
    );
  }

}
