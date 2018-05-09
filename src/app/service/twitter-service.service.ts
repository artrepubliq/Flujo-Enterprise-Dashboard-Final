import { Injectable } from '@angular/core';
import { AppConstants } from '../app.constants';
import { HttpClient } from '@angular/common/http';
import { ITwitterTimelineObject, ITwitTimeLineObject } from '../model/twitter/twitter.model';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class TwitterServiceService {

  constructor(
    private httpClient: HttpClient
  ) { }

  public getTimeLine(): Observable<ITwitTimeLineObject> {
    return this.httpClient.get<ITwitTimeLineObject>(AppConstants.EXPRESS_URL + 'oauth_token/' + AppConstants.CLIENT_ID);
  }

}
