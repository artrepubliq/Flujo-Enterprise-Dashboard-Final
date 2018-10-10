import { Component } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Input } from '@angular/core';
import * as _ from 'underscore';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MessageService } from '../service/message.services';
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html'
})

export class MessagesComponent {
  @Input()
  bufferValue: number;
  @Input()
  value: number;
  @Input()
  diameter: number;

  constructor(public messageService: MessageService) {
    // console.log(this.messageService);
    // _.each(messageService.messages, (message)=>{
    //   this.value = +message;
    //   // console.log(this.value);
    // })
  }
}
