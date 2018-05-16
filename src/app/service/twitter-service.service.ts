import { Injectable } from '@angular/core';
import { AppConstants } from '../app.constants';
import { HttpClient } from '@angular/common/http';
import {
  ITwitterTimelineObject,
  ITwitTimeLineObject,
  ITwitTimeLineObejctMaxId,
  ITwitterUserProfile, ITwitUser, ITStatusResponse
} from '../model/twitter/twitter.model';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TwitterServiceService {

  constructor(
    private httpClient: HttpClient
  ) { }

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
  public getOldHomeTimeline(max_id): Observable<ITwitTimeLineObejctMaxId> {

    return this.httpClient.get<ITwitTimeLineObejctMaxId>
      (AppConstants.EXPRESS_URL + 'timeline/' + max_id);
  }
  /**
   *
   * @param headers Headers we need to pass twitter feature token and expiry date
   * it returns the various timelines like user, home, mentions, retweets
   */
  public getTwitterUserProfiles(headers): Observable<ITwitUser> {
    return this.httpClient.get<ITwitUser>(
      AppConstants.EXPRESS_URL + 'userprofile/' + AppConstants.CLIENT_ID, { headers: headers }
    );
  }

  /**
   * this is a service for posting a status on twitter
   * @param status this is the status we need to post, this should be
   * an object
   */
  public postStatusOnTwitter(status): Observable<ITStatusResponse> {
    return this.httpClient.post<ITStatusResponse>(
      AppConstants.EXPRESS_URL + 'poststatus', status
    );
  }

  /**
   * this is a service to delete a tweet on twitter
   * @param tweet_id this is a tweet_id that we need to delete this must be an object
   */
  public deleteTweetOfId(tweet_id): Observable<ITStatusResponse> {
    return this.httpClient.post<ITStatusResponse>(
      AppConstants.EXPRESS_URL + 'deletetweet', tweet_id
    );
  }
  /**
   * this is to retweet the status or a tweet
   * @param tweet_id this is a tweet_id that we need to retweet this must be an object
   */
  public retweetOfId(tweet_id): Observable<ITStatusResponse> {
    return this.httpClient.post<ITStatusResponse>(
      AppConstants.EXPRESS_URL + 'retweet', tweet_id
    );
  }
}
