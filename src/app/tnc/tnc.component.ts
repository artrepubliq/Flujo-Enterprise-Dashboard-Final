import { Component, OnInit } from '@angular/core';
import { AdminComponent } from '../admin/admin.component';
import { Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import * as _ from 'underscore';
@Component({
  selector: 'app-tnc',
  templateUrl: './tnc.component.html',
  styleUrls: ['./tnc.component.scss']
})
export class TncComponent implements OnInit {

  filteredUserAccessData: any;
  userAccessLevelObject: any;
  constructor(public adminComponent: AdminComponent, private router: Router, private spinnerService: Ng4LoadingSpinnerService) {
    if (this.adminComponent.userAccessLevelData) {
      console.log(this.adminComponent.userAccessLevelData[0].name);
      this.userRestrict();
    } else {
      this.adminComponent.getUserAccessLevelsHttpClient()
        .subscribe(
          resp => {
            console.log(resp);
            this.spinnerService.hide();
            _.each(resp, item => {
              if (item.user_id === localStorage.getItem('user_id')) {
                  this.userAccessLevelObject = item.access_levels;
              }else {
                // this.userAccessLevelObject = null;
              }
            });
            this.adminComponent.userAccessLevelData = JSON.parse(this.userAccessLevelObject);
            this.userRestrict();
          },
          error => {
            console.log(error);
            this.spinnerService.hide();
          }
        );
    }
   }

  ngOnInit() {
  }
 // this for restrict user on root access level
 userRestrict() {
  _.each(this.adminComponent.userAccessLevelData, (item, iterate) => {
    // tslint:disable-next-line:max-line-length
    if (this.adminComponent.userAccessLevelData[iterate].name === 'Report an issue' && this.adminComponent.userAccessLevelData[iterate].enable) {
      this.filteredUserAccessData = item;
      } else {
        // this.router.navigate(['/accessdenied']);
        // console.log('else');
      }
    });
    if (this.filteredUserAccessData.name) {
      this.router.navigate(['/biography']);
    }else {
      this.router.navigate(['/accessdenied']);
      console.log('else');
    }
}
}
