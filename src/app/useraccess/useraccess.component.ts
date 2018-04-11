import { Component, OnInit, Injectable } from '@angular/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { HttpClient } from '@angular/common/http';
import { AlertService } from 'ngx-alerts';
import { IAccessLevelModel } from '../model/accessLevel.model';
import { AppConstants } from '../app.constants';
import * as _ from 'underscore';
// @Component({
//   template: '',

// })
@Injectable()
export class UseraccessComponent implements OnInit {
  error: string;
  MainUserAccessLevelObject: any;
  constructor (private httpClient: HttpClient) {
  }
  ngOnInit () {
    this.getUserAccessLevelData();
  }
  getUserAccessLevelData (): any {
    return  this.httpClient.get<Array<IAccessLevelModel>>(AppConstants.API_URL + '/flujo_client_getuseraccess/' + AppConstants.CLIENT_ID);
//       this.getUserAccessLevelsHttpClient()
//         .subscribe(
//           data => {
//             _.each(data, item => {
//               if (item.user_id === localStorage.getItem('user_id')) {
//                 this.MainUserAccessLevelObject = item.access_levels;
//               } else {
//                 this.error = 'test';
//               }
//             });
//             if (this.MainUserAccessLevelObject) {
// return this.MainUserAccessLevelObject
//             } else return
//           },
//           error => {
//             console.log(error);
//             return "error";
//           }
//         );
    }
    getUserAccessLevelsHttpClient() {
      return  this.httpClient.get<Array<IAccessLevelModel>>(AppConstants.API_URL + '/flujo_client_getuseraccess/' + AppConstants.CLIENT_ID);
    }
  }
