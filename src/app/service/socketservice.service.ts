import { Injectable } from '@angular/core';
// tslint:disable-next-line:import-blacklist
import { Observable, Observer, Subject } from 'rxjs';
import * as socketIo from 'socket.io-client';
import { AppConstants } from '../app.constants';
import { ISendMessageObject } from '../model/users';
import { IMessage } from '../model/IMesage';
import { HttpErrorHandler, HandleError } from '../http-error-handler.services';
import { catchError } from 'rxjs/operators';
import { ChatDockUsersService } from './chat-dock-users.service';

@Injectable()
export class SocketService {
  private handleError: HandleError;

  constructor(
    httpErrorHandler: HttpErrorHandler,
    private chatDockUsersService: ChatDockUsersService
  ) {
    this.handleError = httpErrorHandler.createHandleError('SocketService');
  }
  private privateChatSocket;
  public initSocket(clientId) {
    return new Promise((resolve, reject) => {
      this.privateChatSocket = socketIo(`${AppConstants.SOCEKT_API_URL}/privatechat?client_id=${clientId}`);
      this.privateChatSocket.on('connection', (data: any) => {
        console.log(data);
        this.chatDockUsersService.announceMission('true');
        resolve(this.privateChatSocket);
      });
      this.privateChatSocket.on('reconnect_attempt', () => {
        console.log('Reconnecting.....');
        this.chatDockUsersService.setSocketReconnection(true);
      });
    });

  }
  // connectSocket = () => {
  //   return new Promise((resolve) => {
  //     this.privateChatSocket.on('connection', (data: any) => {
  //       console.log(data);
  //       this.socketConnectionListenerService.announceMission('true');
  //       resolve(data.status);
  //     });
  //   });
  // }
  // LOGIN SUCCESS EMITER TO SERVER
  loginSuccessEventEmit = (userData) => {
    this.privateChatSocket.emit('user_login', userData);
  }

  // EMIT TO CHANGE LOGGEDIN USERS STATUS
  emitToChangeLoggedinUserStatus = (userObject) => {
    this.privateChatSocket.emit('emit_change_loggedin_user_status', userObject);
  }
  // LISTENER TO CHANGE LOGGEDIN USERS STATUS
  listenerForChangeLoggedinUserStatus = () => {
    return new Observable<any>( observer => {
      this.privateChatSocket.on('listener_change_loggedin_user_status', userData => {
        observer.next(userData);
      });
    });
  }
  // LISTENER CALL FOR LOGGED USERS
  listenLoggedUsersListener = () => {
    console.log('listen socket ');
    return new Observable<any>(observer => {
      this.privateChatSocket.on('new_users', (loggedUsers: any) => {
        observer.next(loggedUsers);
      });
    });
  }
  public onMessage(): Observable<ISocketInfo> {
    socketIo(AppConstants.SOCEKT_API_URL);
    return new Observable<ISocketInfo>(observer => {
      this.privateChatSocket.on('connection', (data: any) => {
        console.log(data);
        observer.next(data);
      });
    });
  }

  public onEvent(event): void {
    this.privateChatSocket.emit(event, 'test');
    this.privateChatSocket.emit(event, 'test');
  }

  public joinRoom(usernameRoom, socket_id) {
    this.privateChatSocket.emit('joinRoom', usernameRoom);
  }

  public getSuccessResp(): Observable<any> {
    return new Observable(observer => {
      this.privateChatSocket.on('success', (data: any) => {
        observer.next(data);
      });
    });
  }

  public getErrorResp(): Observable<any> {
    return new Observable(observer => {
      this.privateChatSocket.on('err', (data: any) => {
        observer.next(data);
      });
    });
  }

  sendMessageService(messageObject) {
    console.log(messageObject);
    this.privateChatSocket.emit('send_new_message', messageObject);
  }
  // SOCKET LISTENER TO GET CONFIRMATION FOR MESSAGE STORED IN DATABASE OR NOT
  listenerForIsNewMessageStoredInDB = (): Observable<any> => {
    return new Observable((observer) => {
      this.privateChatSocket.on('new_message_stored_in_db_confirm', (resp: any) => {
        observer.next(resp);
      });
    });
  }

  // listen for new Messages
  listenNewMessages(): Observable<ISendMessageObject> {
    return new Observable<ISendMessageObject>(observer => {
      this.privateChatSocket.on('receive_new_message', (data) => {
         observer.next(data);
      });
    });
  }

  // INITIALIZE THE SOCKET CONNECTION ERROR
  listenSocketConnectionError = () => {
    return new Observable((observer) => {
      this.privateChatSocket.on('connect_error', (error) => {
        observer.next(error);
      });
    });
  }

  // EMITOR FOR USER MESSAGE TYPING INDICATOR
  emitUserMessageTypingIndication = (socketKey, user_id) => {
    this.privateChatSocket.emit('user_typing_emit', { socket_key: socketKey, user_id: user_id });
  }

  // SOCKET LISTENER FOR MESSAGW TYPING
  listenerUserMessageTypingIndication = () => {
    return new Observable((observer) => {
      this.privateChatSocket.on('user_typing_listener', listener => {
        observer.next(listener);
      });
    });
  }
  // SOCKET EMIT FOR RECEIVED MESSAGE CONFIRMATION
  emitNewMessageReceivedConfirmation = (emitObject) => {
    this.privateChatSocket.emit('message_received_confirm_from_receiver', emitObject);
  }
  // SOCKET LISTENER FOR RECEIVED MESSAGE CONFIRMATION
  listenNewMessageReceivedConfirmation = () => {
    return new Observable((observer) => {
      this.privateChatSocket.on('message_received_confirm_to_sender', listenerEvent => {
        console.log(listenerEvent);
        observer.next(listenerEvent);
      });
    });
  }
  // SOCKET EMIT FOR READ MESSAGE CONFIRMATION
  emitNewMessageReadConfirmation = (emitObject) => {
    console.log('read confirm');
    this.privateChatSocket.emit('message_read_confirm_from_receiver', emitObject);
  }

  // SOCKET LISTENER FOR READ MESSAGE CONFIRMATION
  listenNewMessageReadConfirmation = () => {
    return new Observable((observer) => {
      this.privateChatSocket.on('message_read_confirm_to_sender', listenerEvent => {
        console.log(listenerEvent);
        observer.next(listenerEvent);
      });
    });
  }
  // SOCKET EMIT TO UPDATE THE EXISTING MESSAGE BY MESSAGE ID
  emitUpdatedMessage = (updatedMessage) => {
    this.privateChatSocket.emit('update_sender_old_message_emit', updatedMessage);
  }
  // SOCKET EMIT TO UPDATE THE EXISTING MESSAGE BY MESSAGE ID
  listenerForUpdatedOldMessage = () => {
    return new Observable((observer) => {
      this.privateChatSocket.on('update_sender_old_message_listen', updateEvent => {
        console.log(updateEvent, 174);
        observer.next(updateEvent);
      });
    });
  }

  // SOCKET EMIT TO DELETE THE MESSAGE FROM THE CONVERSATIONS
  emitMessageObjectToDeleteMessage = (messageObject) => {
    this.privateChatSocket.emit('delete_old_message', messageObject);
  }
  // SOCKET LISTENER FOR DELETE OLD MESSAGES SUCCESS LISTENER
  deleteOldMessageSuccessListener = () => {
    return new Observable(observer => {
      this.privateChatSocket.on('delete_old_message_succes_listener', succEvent => {
        observer.next(succEvent);
      });
    });
  }

  // R&D IMPLEMENTATION
  // this is to add user to a socket
  public addUsers(username: { username: string }) {
    this.privateChatSocket.emit('new user', username.username);
  }

  public getUsers() {
    return new Observable<any>(observer => {
      this.privateChatSocket.on('usernames', data => {
        observer.next(data);
      });
    });
  }

  sendPrivateMessage = (messageData: { nickname: string, message: string, from_user: string }) => {
    this.privateChatSocket.emit('sendmessage', messageData);
  }

  listenToPrivateMessages = () => {
    return new Observable<IMessage>(observer => {
      this.privateChatSocket.on('new message', data => {
        observer.next(data);
      });
    });
  }

  disconnectPrivateChatUserSocket = (socketKey: string) => {
    this.privateChatSocket.emit('disconnect_private_chat_socket', { socket_key: socketKey });
  }

  closeSockectForThisUser = () => {
    this.privateChatSocket.disconnect();
    this.privateChatSocket.close();
  }
}


export interface ISocketInfo {
  is_connected: boolean;
  socket_id: string;
}
