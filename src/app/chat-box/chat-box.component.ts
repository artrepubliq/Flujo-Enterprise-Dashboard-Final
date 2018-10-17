import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef, HostListener, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ISelectedUsersChatWindow, IUser, ISendMessageObject } from '../model/users';
import { SocketService } from '../service/socketservice.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import * as $ from 'jquery';
import { ChatHttpApiService } from '../service/chat-http-api.service';
import { ChatDockUsersService } from '../service/chat-dock-users.service';
import { UploaderService } from '../service/uploader.service';
import * as _ from 'underscore';
import { AppConstants } from '../app.constants';
import { NG_ASYNC_VALIDATORS, Validator, FormControl, ValidationErrors } from '@angular/forms';
import { FileValidator } from '../service/file-input.validator';
import { isObject } from 'util';

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
  @ViewChild('smallWindow') smallWindow: ElementRef;
  private unSubscribe = new Subject<any>();
  // config: any;
  selectedUsers: ISelectedUsersChatWindow[];
  loggedinUserObject: IUser;
  listOfUsers: IUser[];
  selectedEmoji = [];
  // isEmoji: boolean;
  constructor(private chatDockUsersService: ChatDockUsersService,
    private socketService: SocketService,
    private chatHttpApiService: ChatHttpApiService,
    private uploaderService: UploaderService,
    private cd: ChangeDetectorRef,
    private formBuilder: FormBuilder) {
    this.listOfUsers = [];
    this.chatDockUsersService.getChatUser().takeUntil(this.unSubscribe).subscribe(
      (chatObject: any) => {
        this.handleChatWindowForSelectedUsers(chatObject, null);
      },
      error => {
        console.log(error);
      }
    );
    this.chatDockUsersService.getLoggedinUser().subscribe(
      loggedinUser => {
        console.log('loggedin users');
        this.loggedinUserObject = loggedinUser;
        this.listenAllTheSocketServices();
      },
      err => {
        console.log(err);
      }
    );
    this.chatDockUsersService.getListOfUsers().subscribe(
      listOfUsers => {
        this.listOfUsers = listOfUsers;
      },
      err => {
        console.log(err);
      }
    );
  }

  ngOnInit() {
    this.messageInputForm = this.formBuilder.group({
      'message': ['', Validators.required],
      fileupload: new FormControl("", [FileValidator.validate]),
      'message_type': ['']
    });
    this.selectedUsers = [];
  }

  ngAfterViewInit() {
  }
  ngOnDestroy(): void {
    this.unSubscribe.complete();
  }

  // LISTEN ALL THE SERVICES
  listenAllTheSocketServices = () => {
    this.socketListenerForNewMessages();
    this.listenerForMessageReachedConfirmation();
    this.listenForNewMessageReadConfirm();
    this.listenForInputTypingIndicator();
    this.deleteOldMessageSuccessListener();
  }
  // SOCKET LISTENER FOR INCOMING NEW MESSAGES
  socketListenerForNewMessages = () => {
    this.socketService.listenNewMessages().subscribe(
      newMsg => {
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
          }
        },
        listErrResp => {
          console.log(listErrResp);
        }
      );
  }
  // THIS WILL USE FOR ADD NEW USER TO SELECTEDUSERS ARRAY, WHWN THE LOGIN USER COULD'T SELECT THE USER.
  prepeareNewUserToStartConvesation = (newMsg: ISendMessageObject) => {
    const ReceiverData = this.listOfUsers.filter(item => {
      return (item.user_id === newMsg.sender_id);
    });
    const receiveEmitObjet = {
      socket_key: ReceiverData[0]['socket_key'],
      received_time: new Date().toISOString(),
      _id: [newMsg._id],
      user_id: this.loggedinUserObject.user_id
    };
    this.socketService.emitNewMessageReadConfirmation(receiveEmitObjet);
    newMsg.received_time = this.getNewTimeForSendReceivemessage();
    this.handleChatWindowForSelectedUsers(ReceiverData[0], newMsg);
  }
  // LOGOUT THE USER
  logoutUser = () => {
    this.socketService.disconnectPrivateChatUserSocket(this.loggedinUserObject.socket_key);
    this.socketService.closeSockectForThisUser();
  }
  processUploadingFiles = (event, selecteduseritem, i) => {
    const files = [];
    _.each(event.target.files, (file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.messageInputForm.patchValue({
          file: reader.result
        });
        const formData = new FormData();
        formData.append(file, file);
        this.addAWSFileChat(formData, selecteduseritem, i);
        // event.input('#file')
    }
  })
}

  onFileUpload(event, selecteduseritem, i){
    // document.getElementById("myFile").accept = "audio/*";
    if (event.target.files && event.target.files.length) {
      const files = this.processUploadingFiles(event, selecteduseritem, i);
    }
  }


  triggerUpload() {
    $('#picked').click();
  }

  addAWSFileChat = async (formData, selecteduseritem, i) => {
    const awsFiles = [];
    this.uploaderService.upload(formData).subscribe(
      awsFileUrl => {
        console.log(awsFileUrl);
        this.sendMessageToSelectedReceiver(selecteduseritem, i, awsFileUrl);
      },
      error => {
        console.log(error);
      })
  }

  triggerEnter(){
    $('#send-button').click();
  }

  // SEND MESSAGE WITH USER NAME
  sendMessageToSelectedReceiver = (selecteduseritem: ISelectedUsersChatWindow, index?: number, file?: any, $event?: any) => {
console.log($event);
    if (selecteduseritem) {
      const receiverMessageObject = <ISendMessageObject>{};
      receiverMessageObject.message = file ? file.location : this.messageInputForm.value.message;
      receiverMessageObject.fileName = file ? file.originalname : '';
      receiverMessageObject.fileSize = file ? this.uploaderService.bytesToSize(file.size) : null;
      selecteduseritem.fileName = file ? file.originalname : '';
      selecteduseritem.fileSize = file ? this.uploaderService.bytesToSize(file.size) : null;
      this.messageInputForm.reset();
      receiverMessageObject.receiver_id = selecteduseritem.receiver_id;
      receiverMessageObject.sender_id = selecteduseritem.sender_id;
      receiverMessageObject.socket_key = selecteduseritem.socket_key;
      receiverMessageObject.status = -1;
      receiverMessageObject.message_type = file ? file.mimetype : 'text';
      const dateTime = new Date();
      receiverMessageObject.created_time = dateTime.toISOString();
      this.socketService.sendMessageService(receiverMessageObject);
      this.socketService.listenerForIsNewMessageStoredInDB()
        .then((succ: ISendMessageObject) => {
          if(isObject(file) && file){
          succ.fileName = file.originalname;
          succ.fileSize = this.uploaderService.bytesToSize(file.size);
         }
        //  var i = index;
        // console.log(this.selectedUsers);
          this.selectedUsers[index].chat_history = [...this.selectedUsers[index].chat_history, succ];
        })
        .catch(err => {
            console.log(err);
        });
    }
  }


  // SOCKET LISTENER TO GET THE MESSAGE REACHED CONFIRMATION FROM THE RECEIVER
  listenerForMessageReachedConfirmation = () => {
    this.socketService.listenNewMessageReceivedConfirmation().subscribe(
      (listenerSuccResp: any) => {
        this.selectedUsers.map((useritem) => {
          if (useritem.receiver_id === listenerSuccResp.user_id) {
            useritem.chat_history.map((messageItem, index) => {
              if (listenerSuccResp._id.some(idItem => idItem === messageItem._id)) {
                useritem.chat_history[index].status = 0;
              }
            });
          }
        });
      },
      errorResp => {
        console.log(errorResp);
      });
  }
  listenForNewMessageReadConfirm = () => {


   const res = this.socketService.listenNewMessageReadConfirmation().subscribe(
      (succResp: any) => {
        console.log(succResp);
        if(!succResp){
        const index = this.selectedUsers.findIndex(item => item.receiver_id === succResp.user_id);

        succResp._id.map(id => {
          if(index>0){
            this.selectedUsers[index].chat_history.map(item => {
              if (item._id === id) {
                item.status = 1;
              }
            });
          }
        });
      }
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
    // this.dissableAllActivatedInputs();
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
    if (chatMessage) {
      messageObject.chat_history = [...messageObject.chat_history, chatMessage];
    }
    if (!this.selectedUsers.some((selecteUserItem) => {
      return selecteUserItem.receiver_id === userItem.user_id;
    })) {
      messageObject.receiver_name = userItem.user_name;
      messageObject.receiver_id = String(userItem.user_id);
      messageObject.sender_id = this.loggedinUserObject.user_id;
      messageObject.socket_key = userItem.socket_key;
      messageObject.isWindowOpened = true;
      messageObject.isInputActivated = true;
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
      client_id: AppConstants.CLIENT_ID,
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
    this.chatDockUsersService.emitcloseChatWindow(selecteduseritem.receiver_id);
  }

  // LISTENER THE MESSAGE TYPING EVENTS TO HANDLE THE TYPE INDICATORE FOR TOHER SIDE
  onMessageInputListener = (input, selecteduseritem: ISelectedUsersChatWindow, userIndex) => {
    this.dissableAllActivatedInputs();
    this.selectedUsers[userIndex].isInputActivated = true;
    if (!this.isInputListenInterval) {
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

  dissableAllActivatedInputs = () => {
    this.selectedUsers.map(item => {
      if (item.isInputActivated) {
        item.bufferMessage = this.messageInputForm.value['message'];
      }
      item.isInputActivated = false;
      // item.isEmojiWindowOpened = false;
    });
  }
  activateSelectedWindow = (windowIndex) => {
    this.dissableAllActivatedInputs();
    this.selectedUsers[windowIndex].isInputActivated = true;
    this.messageInputForm.controls['message'].setValue(this.selectedUsers[windowIndex].bufferMessage);
  }

  // ADD EMOJI WINDOW FOR SELECTED USERS
  addEmojiForSelectedWindow = (index) => {
    this.selectedUsers[index].bufferMessage = this.messageInputForm.value['message'];
    this.selectedUsers[index].isEmojiWindowOpened = !this.selectedUsers[index].isEmojiWindowOpened;
  }
  addEmoji = (event) => {
    this.messageInputForm.controls['message'].setValue(`${this.messageInputForm.value['message']}${event.emoji.native}`);
  }
  maximizeWindow = () => {
    this.smallWindow.nativeElement.classList.remove('smallWindow');
    this.smallWindow.nativeElement.classList.add('maximize_window');
  }
  minimizeWindow = () => {
    this.smallWindow.nativeElement.classList.add('smallWindow');
    this.smallWindow.nativeElement.classList.remove('maximize_window');
  }
  hideChatWindow = (selecteduseritem: ISelectedUsersChatWindow, index) => {
    selecteduseritem.isChatWindowMinimized = !selecteduseritem.isChatWindowMinimized;
  }

  // DELETET THE MESSAGE
  deleteMessage = (selectedUserindex, chatHistoryIndex) => {
    // tslint:disable-next-line:max-line-length
    this.selectedUsers[selectedUserindex].chat_history[chatHistoryIndex].showMessageOptions = !this.selectedUsers[selectedUserindex].chat_history[chatHistoryIndex].showMessageOptions;
  }
  deleteMessageConfirm = (chatItem: ISendMessageObject, status, userIndex) => {
    const deleteObject = {
      _id: chatItem._id,
      deleted_from: chatItem.sender_id === this.loggedinUserObject.user_id ? chatItem.sender_id : chatItem.receiver_id,
      deleted_to: chatItem.receiver_id === this.loggedinUserObject.user_id ? chatItem.sender_id : chatItem.receiver_id,
      status: status,
      sender_socket_key: this.loggedinUserObject.socket_key,
      receiver_socket_key: status === 'true' ? this.selectedUsers[userIndex].socket_key : null
    };
    this.socketService.emitMessageObjectToDeleteMessage(deleteObject);
  }

  // DELETE OLD MESSAGE SUCCESS EVENT LISTENER
  deleteOldMessageSuccessListener = () => {
    this.socketService.deleteOldMessageSuccessListener().subscribe(
      (succResp: any) => {
        this.selectedUsers.map(item => {
          if (item.receiver_id === succResp.deleted_to) {
            const messageIndex = item.chat_history.findIndex(msgItem => msgItem._id === succResp._id);
            if (messageIndex >= 0) {
              item.chat_history.splice(messageIndex, 1);
            }
          } else if (item.sender_id === succResp.deleted_to) {
            const messageIndex = item.chat_history.findIndex(msgItem => msgItem._id === succResp._id);
            if (messageIndex >= 0) {
              item.chat_history.splice(messageIndex, 1);
            }
          }
        });
      },
      errResp => {
        console.log(errResp);
      });
  }

  updateMessage(chatItem: ISendMessageObject, userIndex) {
    this.selectedUsers[userIndex].messageUpdateObject = chatItem;
    const inputInterval = setInterval(() => {
      const input = <HTMLInputElement>document.getElementById(chatItem.sender_id);
      if (input) {
        input.value = chatItem.message;
        clearInterval(inputInterval);
      }
    }, 1);
  }

  // UPDATE MESSAGE CONFIRM
  updateMessageConfirm = (userIndex, status: boolean) => {
    const messageObject = this.selectedUsers[userIndex].messageUpdateObject;
    const input = <HTMLInputElement>document.getElementById(messageObject.sender_id);
    if (status) {
      const updatedObject = {
        _id: messageObject._id,
        sender_id: messageObject.sender_id,
        receiver_id: messageObject.receiver_id,
        sender_socket_key: this.loggedinUserObject.socket_key,
        receiver_socket_key: this.selectedUsers[userIndex].socket_key,
        message: input.value,
        created_time: new Date().toISOString()
      };
      this.socketService.emitUpdatedMessage(updatedObject);
    }
    input.value = '';
    this.selectedUsers[userIndex].messageUpdateObject = null;
  }

  // LISTENER FOR OLD MESSAGE UPDATIONS
  listenerOldMessageUpdations = () => {
    this.socketService.listenerForUpdatedOldMessage().subscribe(
      (success: any) => {
        if (success.updated) {
          this.selectedUsers.map(item => {
            if (item.sender_id === success.sender_id) {
              const chatIndex = item.chat_history.findIndex(chatItem => chatItem._id === success._id);
              if (chatIndex >= 0) {
                item.chat_history[chatIndex].message = success.message;
              }
            } else if (item.sender_id === success.receiver_id) {
              const chatIndex = item.chat_history.findIndex(chatItem => chatItem._id === success._id);
              if (chatIndex >= 0) {
                item.chat_history[chatIndex].message = success.message;
              }
            }
          });
        }
      },
      err => {
        console.log(err);
      }
    );
  }

}
