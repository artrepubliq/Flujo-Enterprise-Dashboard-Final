import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class PushNotificationService {
  public permission: Permission;
  constructor() {
    this.permission = this.isSupported() ? 'default' : 'denied';
  }
  public isSupported(): boolean {
    return 'Notification' in window;
  }
  requestPermission(): void {
    const self = this;
    if ('Notification' in window) {
      Notification.requestPermission(function (status) {
        return self.permission = status;
      });
    }
  }
  create(title: string, options?: PushNotification): any {
    const self = this;
    return new Observable(function (obs) {
      if (!('Notification' in window)) {
        console.log('Notifications are not available in this environment');
        obs.complete();
      }
      if (self.permission !== 'granted') {
        console.log('The user hasn\'t granted you permission to send push notifications');
        obs.complete();
      }
      const _notify = new Notification(title, options);
      // _notify.onshow = function (e) {
      //   console.log('show');
      //   return obs.next({
      //     notification: _notify,
      //     event: e,
      //   });
      // };
      _notify.onclick = function (e) {
        return obs.next({
          notification: _notify,
          event: e,
          showMessage: true
        });
      };
      _notify.onerror = function (e) {
        return obs.error({
          notification: _notify,
          event: e
        });
      };
      _notify.onclose = function () {
        return obs.complete();
      };
    });
  }
  generateNotification(source: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const self = this;
      // source.forEach((item) => {
        const options = {
          body: source.alertContent,
          icon: '../assets/flujo-favicon.png'
        };
        const notify = self.create(source.title, options).subscribe(
          resp => {
            resolve(resp);
          },
          err => {
            reject(err);
          }
        );
      // });
    });
  }
}
export declare type Permission = 'denied' | 'granted' | 'default';
export interface PushNotification {
  body?: string;
  icon?: string;
  tag?: string;
  data?: any;
  renotify?: boolean;
  silent?: boolean;
  sound?: string;
  noscreen?: boolean;
  sticky?: boolean;
  dir?: 'auto' | 'ltr' | 'rtl';
  lang?: string;
  vibrate?: number[];
}
