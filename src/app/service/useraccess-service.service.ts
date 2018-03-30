import { Injectable } from '@angular/core';
import { IAccessLevelModel } from '../model/accessLevel.model';
import { AppConstants } from '../app.constants';
import { HttpClient } from '@angular/common/http';
import * as _ from 'underscore';
@Injectable()
export class UseraccessServiceService {

  userAccessLevelObject: IAccessLevelModel;
  constructor(private httpClient: HttpClient) { }
  getUserAccessLevelData = () => {
    return;
    // this.httpClient.get<Array<IAccessLevelModel>>(AppConstants.API_URL + '/flujo_client_getuseraccess/' + AppConstants.CLIENT_ID)
    //   .subscribe(
    //     data => {
    //       console.log(data);
    //       console.log(localStorage.getItem('id_token'));
    //       _.each(data, item => {
    //         if (item.user_id === localStorage.getItem('id_token')) {
    //             this.userAccessLevelObject = item.access_levels;
    //         }else {
    //           // this.userAccessLevelObject = null;
    //         }
    //       });
    //       console.log(this.userAccessLevelObject);
    //       return this.userAccessLevelObject;
    //     },
    //     error => {
    //       console.log(error);
    //     }
    //   );
  }
}
