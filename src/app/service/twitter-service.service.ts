import { Injectable } from '@angular/core';
import { AppConstants } from '../app.constants';
import { HttpClient } from '@angular/common/http';
import {
  ITwitterTimelineObject,
  ITwitTimeLineObject,
  ITwitTimeLineObejctMaxId,
  ITwitterUserProfile, ITwitUser
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


}
