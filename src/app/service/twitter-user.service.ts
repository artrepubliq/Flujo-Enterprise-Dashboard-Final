import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ITwitUser } from '../model/twitter/twitter.model';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class TwitterUserService {
  public userData: ITwitUser;
  public subject = new Subject<ITwitUser>();
  constructor() { }

  /**
   * This is for adding user data as an observable
   * @param userData this is the twitter user data that needs to be assigned
   */
  public addUser(userData: ITwitUser): void {
    this.userData = userData;
    this.subject.next({...this.userData, ...userData});
  }

  /**
   * this function returns the twitter user data;
   */
  public getTwitusers(): Observable<ITwitUser> {
    return this.subject.asObservable();
  }

  public get getTwitterUserData(): ITwitUser {
    return this.userData;
  }

}
