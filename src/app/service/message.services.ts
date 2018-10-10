import { Injectable } from '@angular/core';
import * as _ from 'underscore';

@Injectable()
export class MessageService {
  messages: string[] = [];
  percentage: number;
  hideProgress: boolean;
  add(message: string) {
    this.messages.push(message);
    _.each(this.messages, (messageItem) => {
      this.percentage = +parseInt(messageItem, null);
    });
    if (this.percentage === 100) {
      this.percentage = 0;
      console.log(this.percentage);
    }
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
