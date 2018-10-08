import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { Observable } from 'rxjs/Observable';
import { IUser } from '../model/users';

@Injectable()
export class ChatDockUsersService {

  private chatDockUsersSubject = new Subject<IUser[]>();
  private chatDockUserSubject = new Subject<IUser>();
  onClickActiveUsers: IUser[] = [];
  constructor() { }

  public addChatUsers(chatUsers: IUser): void {
    this.onClickActiveUsers = [...this.onClickActiveUsers, chatUsers];
    // this.chatDockUsersSubject.next(this.onClickActiveUsers);
    this.chatDockUserSubject.next(chatUsers);
  }

  public getChatUsers(): Observable<IUser> {
    // return this.chatDockUsersSubject.asObservable();
    return this.chatDockUserSubject.asObservable();
  }

}
