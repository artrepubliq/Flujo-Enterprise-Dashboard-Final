import { Injectable } from '@angular/core';
import * as _ from 'underscore';

@Injectable()

export class MessageService {

  messages: string[] = [];
  percentage: number;
  hideProgress: boolean;
  fileEvent: number;
  add(message: string) {
    console.log(message);
    this.messages.push(message);
    _.each(this.messages, (messageItem) => {
      if(parseInt(messageItem)>0){
       this.percentage = +parseInt(messageItem, null);
      }
      else{
        this.fileEvent = messageItem;
      }
    });
  }

  clear() {
    this.messages = [];
  }
}


/*
Copyright 2017-2018 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
