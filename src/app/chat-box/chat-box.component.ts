import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef, HostListener, AfterViewInit } from '@angular/core';
import { ChatDockUsersService } from '../chat-componenet/chat-dock-users.service';
import { Subject } from 'rxjs/Subject';
import { ISelectedUsersChatWindow, IUser, ISendMessageObject } from '../model/users';
import { SocketService } from '../service/socketservice.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { ChatHttpApiService } from '../service/chat-http-api.service';
@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent implements OnInit, OnDestroy, AfterViewInit {
  formGroup: any;
  isInputListenInterval = false;
  chatWindowClientHeight = 1000;
  @ViewChild('windowchathistory', { read: ElementRef }) public chathistoryContainer: ElementRef;
  messageInputForm: FormGroup;
  fileInputForm: FormGroup;
  @ViewChild('chatBody') chatBody: ElementRef;
  @ViewChild('chat_box') chat_box: ElementRef;
  @ViewChild('listHeight') listHeight: ElementRef;
  @HostListener('scroll', ['$event'])



  @Input() onClickActiveUsers: any[];
  // @ViewChild('chatWindow') chatWindow: ElementRef;
  // @ViewChild('smallWindow') smallWindow: ElementRef;
  private unSubscribe = new Subject<any>();
  // config: any;
  selectedUsers: ISelectedUsersChatWindow[];
  loggedinUserObject: IUser;
  cd: any;
  listOfUsers: IUser[];
  // isEmoji: boolean;
  constructor(private chatDockUsersService: ChatDockUsersService,
    private socketService: SocketService,
    private chatHttpApiService: ChatHttpApiService,
    private formBuilder: FormBuilder) {
    let isListenersRunning = false;
    this.listOfUsers = [];
    this.chatDockUsersService.getChatUsers().takeUntil(this.unSubscribe).subscribe(
      (chatusers: any) => {
        this.handleChatWindowForSelectedUsers(chatusers, null);
        this.listOfUsers = [...this.listOfUsers, chatusers];
        if (!isListenersRunning) {
          this.listenAllTheSocketServices();
          isListenersRunning = true;
        }
        // if (this.test) {
        //   this.chatWindow.nativeElement.style.display = 'block';
        // }
      },
      error => {
        console.log(error);
      }
    );
  }

  ngOnInit() {
    this.messageInputForm = this.formBuilder.group({
      'message': ['', Validators.required],
      'message_type': ['']

    });
    this.selectedUsers = [];
    // this.listenAllTheSocketServices();
    this.loggedinUserObject = <IUser>{};
    this.loggedinUserObject._id = localStorage.getItem('user_id');
    this.loggedinUserObject.user_id = localStorage.getItem('user_id');
    this.loggedinUserObject.user_name = localStorage.getItem('name');
  }

  ngAfterViewInit() {
  }
  ngOnDestroy(): void {
    this.unSubscribe.complete();
  }
  // maximizeWindow = () => {
  //   this.smallWindow.nativeElement.classList.remove('smallWindow');
  //   this.smallWindow.nativeElement.classList.add('maximize_window');
  // }
  // minimizeWindow = () => {
  //   this.smallWindow.nativeElement.classList.add('smallWindow');
  //   this.smallWindow.nativeElement.classList.remove('maximize_window');
  // }
  // // hideChatWindow = () => {
  // //   if (this.smallWindow.nativeElement.classList[3] !== 'hide_chat') {
  // //     this.smallWindow.nativeElement.classList.add('hide_chat');
  // //   } else {
  // //     this.smallWindow.nativeElement.classList.remove('hide_chat');
  // //   }
  // // }
  // addEmoji = (event) => {
  //   this.isEmoji = !this.isEmoji;
  //   console.log(event);
  // }

  // LISTEN ALL THE SERVICES
  listenAllTheSocketServices = () => {
    this.socketListenerForNewMessages();
    this.listenerForMessageReachedConfirmation();
    this.socketService.listenerForIsNewMessageStoredInDB();
    this.socketService.listenerForIsNewMessageStoredInDB();
    // this.socketService.listenNewMessageReadConfirmation();
    this.listenForNewMessageReadConfirm();
    // this.socketService.listenerUserMessageTypingIndication();
    this.listenForInputTypingIndicator();
  }
  // SOCKET LISTENER FOR INCOMING NEW MESSAGES
  socketListenerForNewMessages = () => {
    this.socketService.listenNewMessages().subscribe(
      newMsg => {
        console.log(newMsg, 116);
        const receiverIndex = this.selectedUsers.findIndex(receiverItem => receiverItem.receiver_id === newMsg.sender_id);
        if (receiverIndex >= 0) {
          const receiveEmitObjet = {
            socket_key: this.selectedUsers[receiverIndex].socket_key,
            received_time: new Date().toISOString(),
            _id: [newMsg._id],
            user_id: this.loggedinUserObject.user_id
          };
          if (this.selectedUsers[receiverIndex].isWindowOpened) {
            this.socketService.emitNewMessageReadConfirmation(receiveEmitObjet);
            newMsg.received_time = this.getNewTimeForSendReceivemessage();
            this.selectedUsers[receiverIndex].chat_history = [...this.selectedUsers[receiverIndex].chat_history, newMsg];
            this.selectedUsers[receiverIndex].isWindowOpened = true;
          } else {
            this.socketService.emitNewMessageReceivedConfirmation(receiveEmitObjet);
            this.selectedUsers[receiverIndex].isWindowOpened = false;
            newMsg.received_time = this.getNewTimeForSendReceivemessage();
            this.selectedUsers[receiverIndex].chat_history = [...this.selectedUsers[receiverIndex].chat_history, newMsg];
          }
          const interval = setTimeout(() => {
            this.chathistoryContainer.nativeElement.scrollTop += this.chatWindowClientHeight;
            clearTimeout(interval);
          }, 10);
        } else {
          // const receivedUser = this.listOfUsers.filter((receiverItem) => {
          //   return receiverItem.user_id === newMsg.sender_id;
          // });

          // this.handleChatWindowForSelectedUsers(receivedUser[0], newMsg);
          // THIS WILL USE FOR ADD NEW USER TO SELECTEDUSERS ARRAY, WHWN THE LOGIN USER COULD'T SELECT THE USER.
          this.prepeareNewUserToStartConvesation(newMsg);
        }
      },
      err => {
        console.log(err);
      }
    );
  }
  // LISTENER FOR INPUT TYPING INDICATORS
  listenForInputTypingIndicator = () => {
    this.socketService.listenerUserMessageTypingIndication()
      .subscribe(
        (lisnSucResp: any) => {
          console.log(lisnSucResp);
          if (this.selectedUsers.length > 0) {
            const userIndex = this.selectedUsers.findIndex(indexItem => indexItem.receiver_id === lisnSucResp.user_id);
            if (userIndex >= 0 && this.selectedUsers[userIndex].isWindowOpened) {
              let interval: any;
              clearTimeout(interval);
              interval = setTimeout(() => {
                this.selectedUsers[userIndex].isTyping = false;
                clearTimeout(interval);
              }, 2000);
              this.selectedUsers[userIndex].isTyping = this.selectedUsers[userIndex].isWindowOpened ? true : false;

            }
            console.log(this.selectedUsers[userIndex]);
          }
        },
        listErrResp => {
          console.log(listErrResp);
        }
      );
  }
  // THIS WILL USE FOR ADD NEW USER TO SELECTEDUSERS ARRAY, WHWN THE LOGIN USER COULD'T SELECT THE USER.
  prepeareNewUserToStartConvesation = (newMsg: ISendMessageObject) => {
    // const dateTime = new Date();
    // const convObject = {
    //   client_id: '1233',
    //   date: moment(dateTime).format('YYYY-MM-DD'),
    //   // conversation_id: newMsg.conversation_id
    // };
    // let username = '';
    // let userSocketKey = '';
    const ReceiverData = this.listOfUsers.filter(item => {
      return (item.user_id === newMsg.sender_id);
    });
    const receiveEmitObjet = {
      socket_key: ReceiverData[0].socket_key,
      received_time: new Date().toISOString(),
      _id: [newMsg._id],
      user_id: this.loggedinUserObject.user_id
    };
    this.socketService.emitNewMessageReadConfirmation(receiveEmitObjet);
    newMsg.received_time = this.getNewTimeForSendReceivemessage();
    this.handleChatWindowForSelectedUsers(ReceiverData[0], newMsg);
    // this.listOfUsers.filter(item => {
    //   if (item.user_id === newMsg.sender_id) {
    //     username = item.user_name;
    //     userSocketKey = item.socket_key;
    //   }
    // });
    // const selectedUser = <ISelectedUsersChatWindow>{};
    // selectedUser.chat_history = [newMsg];
    // // selectedUser.conversation_id = this.createConversationId(this.loggedinUserObject.user_id, newMsg.sender_id);
    // selectedUser.receiver_id = newMsg.sender_id;
    // selectedUser.receiver_name = username;
    // selectedUser.sender_id = this.loggedinUserObject.user_id;
    // selectedUser.socket_key = userSocketKey;
    // this.selectedUsers = [...this.selectedUsers, selectedUser];
    // this.chat_box.nativeElement.style.display = 'block';
  }
  // LOGOUT THE USER
  logoutUser = () => {
    console.log(this.loggedinUserObject);
    this.socketService.disconnectPrivateChatUserSocket(this.loggedinUserObject.socket_key);
    this.socketService.closeSockectForThisUser();
  }
  onFileChange(event, selecteduseritem: ISelectedUsersChatWindow, i) {

    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.messageInputForm.patchValue({
          file: reader.result
        });
        console.log(file);
        const formData = new FormData();
        formData.append('file', file);
        const uploadFile = this.addAWSFileChat(formData, selecteduseritem, i, file);
        //  this.sendMessageToSelectedReceiver(selecteduseritem,  i, file);
        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();
      };
    }
  }
  triggerUpload() {
    $('#file-upload-input').click();
  }
  addAWSFileChat = async (formData, selecteduseritem, i, file) => {
    try {
      const fileUpload = await this.chatHttpApiService.addAWSFile(formData);
      if (!fileUpload.error) {
        this.sendMessageToSelectedReceiver(selecteduseritem, i, fileUpload[0]);
        return fileUpload;
      }
    } catch (errResp) {
      console.log(errResp);
    }
  }

  // send messages with username
  sendMessageToSelectedReceiver = (selecteduseritem: ISelectedUsersChatWindow, index?: number, file?: any) => {
    if (selecteduseritem) {
      const receiverMessageObject = <ISendMessageObject>{};
      receiverMessageObject.message = file ? file.location : this.messageInputForm.value.message;
      this.messageInputForm.reset();
      receiverMessageObject.receiver_id = selecteduseritem.receiver_id;
      receiverMessageObject.sender_id = selecteduseritem.sender_id;
      receiverMessageObject.socket_key = selecteduseritem.socket_key;
      receiverMessageObject.status = -1;
      receiverMessageObject.message_type = file ? file.mimetype : 'text';
      const dateTime = new Date();
      receiverMessageObject.created_time = dateTime.toISOString();
      this.socketService.sendMessageService(receiverMessageObject);
      const inte = setTimeout(() => {
        this.chathistoryContainer.nativeElement.scrollTop += this.chatWindowClientHeight;
        clearTimeout(inte);
      }, 50);

      this.socketService.listenerForIsNewMessageStoredInDB()
        .then(succ => {
          this.selectedUsers[index].chat_history = [...this.selectedUsers[index].chat_history, succ];
        })
        .catch(err => {
          alert('message not sent');
        });
    }
  }


  // SOCKET LISTENER TO GET THE MESSAGE REACHED CONFIRMATION FROM THE RECEIVER
  listenerForMessageReachedConfirmation = () => {
    this.socketService.listenNewMessageReceivedConfirmation().subscribe(
      (listenerSuccResp: any) => {
        console.log(listenerSuccResp, 362);
        this.selectedUsers.map((useritem) => {
          if (useritem.receiver_id === listenerSuccResp.user_id) {
            useritem.chat_history.map((messageItem, index) => {
              if (listenerSuccResp._id.some(idItem => idItem === messageItem._id)) {
                useritem.chat_history[index].status = 0;
              }
            });
          }
        });
        console.log(this.selectedUsers);
      },
      errorResp => {
        console.log(errorResp);
      });
  }
  listenForNewMessageReadConfirm = () => {
    this.socketService.listenNewMessageReadConfirmation().subscribe(
      (succResp: any) => {
        console.log(succResp, 381);
        const index = this.selectedUsers.findIndex(item => item.receiver_id === succResp.user_id);
        succResp._id.map(id => {
          this.selectedUsers[index].chat_history.map(item => {
            if (item._id === id) {
              item.status = 1;
            }
          });
        });
      },
      errResp => {
        console.log(errResp);
      });
  }
  // GENERATE THE NEW TIME FOR SENDING THE MESSAGE AND RECEIVE THE MESSAGE
  getNewTimeForSendReceivemessage = () => {
    const timeZoneOffset = new Date().getTimezoneOffset();
    const dateTime = new Date();
    const received_time = dateTime.toISOString();
    return moment(((new Date(received_time).valueOf()) + (timeZoneOffset * 60))).format();
  }
  handleChatWindowForSelectedUsers = async (userItem: IUser, chatMessage) => {
    this.chat_box.nativeElement.style.display = 'block';
    const dateTime = new Date();
    const date = moment(dateTime).format('YYYY-MM-DD');
    // tslint:disable-next-line:max-line-length
    const chatHistory = await this.getChatHistoryByConversationId(date, this.loggedinUserObject.user_id, userItem.user_id, userItem.socket_key);

    const messageObject = <ISelectedUsersChatWindow>{};
    if (chatHistory) {
      messageObject.chat_history = [];
      messageObject.chat_history = [...messageObject.chat_history, ...chatHistory];
    } else {
      messageObject.chat_history = [];
    }
    if (!this.selectedUsers.some((selecteUserItem) => {
      return selecteUserItem.receiver_id === userItem.user_id;
    })) {
      messageObject.receiver_name = userItem.user_name;
      messageObject.receiver_id = userItem.user_id;
      messageObject.sender_id = this.loggedinUserObject.user_id;
      messageObject.socket_key = userItem.socket_key;
      messageObject.isWindowOpened = true;
      this.selectedUsers.push(messageObject);
      this.handleWindowScroll(messageObject.chat_history.length);
    }
  }
  onScroll(event: any) {
    this.chatWindowClientHeight = event.target.scrollHeight;
    if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
      console.log('end');
    }
  }
  handleWindowScroll = (length) => {
    const interval = setTimeout(() => {
      this.chathistoryContainer.nativeElement.scrollTop += this.chatWindowClientHeight;
      clearTimeout(interval);
    }, 1000);
  }

  getChatHistoryByConversationId = async (date, senderId, receiverId, socketKey) => {
    const convObject = {
      client_id: '1233',
      sender_id: senderId,
      created_time: date,
      receiver_id: receiverId
    };
    let chatsArray: any;
    try {
      chatsArray = await this.chatHttpApiService.getChatConvesationByConversationId(convObject);
      if (!chatsArray.error) {
        let updateMessageIds = [];
        const chatsHistory: ISendMessageObject[] = chatsArray.result;
        chatsHistory.map(item => {
          if (item.receiver_id === senderId && item.status !== 1) {
            item.received_time = new Date().toISOString();
            updateMessageIds = [...updateMessageIds, item._id];
          }
        });
        if (updateMessageIds.length > 0) {
          const emitObject = {
            user_id: receiverId,
            socket_key: socketKey,
            received_time: new Date().toISOString(),
            _id: updateMessageIds,
            status: status
          };
          this.socketService.emitNewMessageReadConfirmation(emitObject);
        }
        return chatsArray.result;
      } else {
        alert('error occured while getting data from conversation');
      }
    } catch (errResp) {
      console.log(errResp);
    }
    // return chatsArray;
  }

  createChatMessageObject = (sender_id, receiver_id, message) => {
    const messageObject = <ISendMessageObject>{};
    messageObject.created_time = this.getNewTimeForSendReceivemessage();
    messageObject.message = message;
    messageObject.receiver_id = receiver_id;
    messageObject.sender_id = sender_id;
    messageObject.status = -1;
    messageObject.visibility = true;
    messageObject.message_type = 'text';
    return messageObject;
  }
  //
  closeChatWindow = (selecteduseritem: ISelectedUsersChatWindow, index) => {
    this.selectedUsers.splice(index, 1);
  }

  // LISTENER THE MESSAGE TYPING EVENTS TO HANDLE THE TYPE INDICATORE FOR TOHER SIDE
  onMessageInputListener = (input, selecteduseritem: ISelectedUsersChatWindow) => {
    if (!this.isInputListenInterval) {
      console.log('if');
      this.socketService.emitUserMessageTypingIndication(selecteduseritem.socket_key, this.loggedinUserObject.user_id);
      this.isInputListenInterval = true;
      const interval = setTimeout(() => {
        this.isInputListenInterval = false;
        clearTimeout(interval);
      }, 2000);
    } else {
      console.log('else');
    }
  }
  chatToggle = (event, index) => {
    this.selectedUsers[index].isWindowOpened = !this.selectedUsers[index].isWindowOpened;
    let updateMessageIds = [];
    this.selectedUsers[index].chat_history.map(item => {
      if (item.status < 1) {
        updateMessageIds = [...updateMessageIds, item._id];
        item.status = 1;
      }
    });
    if (updateMessageIds.length > 0) {
      const emitObject = {
        user_id: this.selectedUsers[index].sender_id,
        socket_key: this.selectedUsers[index].socket_key,
        received_time: new Date().toISOString(),
        _id: updateMessageIds,
        status: 1
      };
      this.socketService.emitNewMessageReadConfirmation(emitObject);
    }

    const pElement = event.target.parentNode.parentNode.parentNode.parentNode;

    if (pElement.classList[1] === 'chatClosed') {
      pElement.classList.remove('chatClosed');
    } else {
      pElement.classList.add('chatClosed');
    }
  }
  maximizeWindow = (event) => {
    const pElement = event.target.parentNode.parentNode.parentNode.parentNode.parentNode;
    if (pElement.classList[1] === 'expansion') {
      pElement.classList.remove('expansion');
    } else {
      pElement.classList.add('expansion');
    }
  }
}
