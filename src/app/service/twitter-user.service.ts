import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ITwitUser, ITwitterTimelineObject } from '../model/twitter/twitter.model';
import { Subject } from 'rxjs/Subject';
// import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class TwitterUserService {

  public userData: ITwitUser;
  public subject = new Subject<ITwitUser>();

  private tweetReplyToObject: ITwitterTimelineObject;
  public replyToTweet = new Subject<ITwitterTimelineObject>();

  constructor() { }

  /**
   * This is for adding user data as an observable
   * @param userData this is the twitter user data that needs to be assigned
   */
  public addUser(userData: ITwitUser): void {
    this.userData = userData;
    this.subject.next({ ...this.userData, ...userData });
  }

  /**
   * this function returns the twitter user data who is logged in
   * as an observable
   */
  public getTwitusers(): Observable<ITwitUser> {
    return this.subject.asObservable();
  }

  /**
   * this is to get user data as who is logged in;
   */
  public get getTwitterUserData(): ITwitUser {
    return this.userData;
  }

  /**
   * this is set object to send replyto a user
   * @param timeline this is the timeline object
   */
  // public sendReplyTo(timeline: ITwitterTimelineObject): void {
  //   this.tweetReplyToObject = timeline;
  //   this.replyToTweet.next(timeline);
  // }
  /**
   * this it get replyTo timeline object as an Observable
   */
  // public getReplyToUser(): Observable<ITwitterTimelineObject> {
  //   return this.replyToTweet.asObservable();
  // }

  /**
   * this is to get the replyTo timeline object
   */
  // public get getReplyToTweetObject(): ITwitterTimelineObject {
  //   return this.tweetReplyToObject;
  // }
}
