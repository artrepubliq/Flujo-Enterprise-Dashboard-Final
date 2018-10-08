import { Component, OnInit, Input } from '@angular/core';
import { IActiveUsers } from '../model/createUser.model';
import { Router } from '@angular/router';
import { BASE_ROUTER_CONFIG } from '../app.router-contstants';
import { ChatDockUsersService } from './chat-dock-users.service';
@Component({
  selector: 'app-chat-componenet',
  templateUrl: './chat-componenet.component.html',
  styleUrls: ['./chat-componenet.component.scss']
})
export class ChatComponenetComponent implements OnInit {
  listOfUsers: any;
  loggedinUserObject: any;
  @Input()
  loggedinUsersList: IActiveUsers;
  onClickActiveUsers: IActiveUsers[] = [];
  isChatWindow: boolean;
  constructor(
    private router: Router,
    private chatDockUsersService: ChatDockUsersService
  ) {
  }

  ngOnInit() {
    console.log(this.loggedinUsersList);
  }
  getUser = (item: IActiveUsers) => {
    this.isChatWindow = true;
    const checkUserLength = this.onClickActiveUsers.filter(chatUser => chatUser.id === item.id).length;
    if (checkUserLength > 0) {
      return;
    } else {
      this.onClickActiveUsers = [...this.onClickActiveUsers, item];
      this.chatDockUsersService.addChatUsers(item);
    }
    console.log(this.onClickActiveUsers);
  }
}
