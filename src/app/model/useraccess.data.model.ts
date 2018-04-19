import { Component, OnInit } from '@angular/core';
import * as _ from 'underscore';
import { IAccessLevelModel } from './accessLevel.model';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../app.constants';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';
import { ICommonInterface } from './commonInterface.model';
@Component({
    template: ``
})
export class AccessDataModelComponent {
    userAccessLevelObject: any;
    userAccessObject: IAccessLevelModel;
    userAccessLevels: IAccessLevelModel[];

    constructor(public httpClient: HttpClient, private router: Router) {
        this.userAccessLevels = [];
    }
    setUserAccessLevels(data: Array<IAccessLevelModel>, feature_id, routURL): any {
        if (data && feature_id) {
            this.checkAccessLevels(data, feature_id, routURL);
        } else {
            this.getUserAccessLevelDataHttp(feature_id, routURL);
        }
    }
    setAccesslevelsToObject = (data, feature_id, routURL) => {
        _.each(data, (iteratee) => {
            this.userAccessObject = <IAccessLevelModel>{};
            this.userAccessObject.enable = iteratee.enable;
            this.userAccessObject.feature_id = iteratee.feature_id;
            this.userAccessObject.name = iteratee.name;
            this.userAccessLevels.push(this.userAccessObject);
        });
        this.checkAccessLevels(this.userAccessLevels, feature_id, routURL);
    }
    getUserAccessLevel = () => {
        return this.userAccessLevels;
    }
    getUserAccessLevelDataHttp = (feature_id, routURL): any => {
        this.httpClient.get<ICommonInterface>(AppConstants.API_URL + '/flujo_client_getuseraccess/' + AppConstants.CLIENT_ID)
          .subscribe(
          data => {
            _.each(data.result, item => {
              if (item.user_id === localStorage.getItem('user_id')) {
                this.userAccessLevelObject = item.access_levels;
              }
            });
            if (this.userAccessLevelObject) {
             this.setAccesslevelsToObject(this.userAccessLevelObject, feature_id, routURL);
            } else {
            //   this.openDialog();
            this.router.navigate(['accessdenied']);
            }
          },
          error => {
            console.log('error fetching access level data in useraccessdata.model.ts');
            return;
          }
          );
      }

      checkAccessLevels = (data: Array<IAccessLevelModel>, feature_id, routURL) => {
        let result = '';
          if (feature_id === 0) {
           console.log(feature_id);
           return true;
          } else {
             result = _.some(data, (iteratee) => {
                return iteratee.feature_id === feature_id && iteratee.enable;
            });
          }
        if (result) {
            this.router.navigate([routURL]);
        } else {
            this.router.navigate(['accessdenied']);
        }
      }
}
