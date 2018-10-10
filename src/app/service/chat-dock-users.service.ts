import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { Observable } from 'rxjs/Observable';
import { IUser, ISendMessageObject } from '../model/users';

@Injectable()
export class ChatDockUsersService {
  private chatDockUserSubject = new Subject<any>();
  private loggedinUserSubject = new Subject<any>();
  private listOfUserSubject = new Subject<IUser[]>();
  private closeChatWindow = new Subject<string>();
  onClickActiveUsers: IUser[] = [];
  constructor() { }

  public addChatUser(chatUser: IUser): void {
    this.chatDockUserSubject.next(chatUser);
  }

  public getChatUser(): Observable<IUser> {
    return this.chatDockUserSubject.asObservable();
  }
  public addLoggedinUser(chatUser: IUser): void {
    this.loggedinUserSubject.next(chatUser);
  }

  public getLoggedinUser(): Observable<IUser> {
    return this.loggedinUserSubject.asObservable();
  }

  public addListOfUsers(chatUser: IUser[]): void {
    this.listOfUserSubject.next(chatUser);
  }

  public getListOfUsers(): Observable<IUser[]> {
    return this.listOfUserSubject.asObservable();
  }


  public emitcloseChatWindow(receiverId: string): void {
    this.closeChatWindow.next(receiverId);
  }

  public listencloseChatWindow(): Observable<string> {
    return this.closeChatWindow.asObservable();
  }
}
