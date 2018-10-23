import { Component, Inject, OnInit, EventEmitter } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { LoginAuthService } from './auth/login.auth.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import * as _ from 'underscore';
import { Router } from '@angular/router';
import { ICommonInterface } from './model/commonInterface.model';
import { AppConstants } from './app.constants';
import { HttpClient } from '@angular/common/http';
import { UserAccesslevelsService } from './service/user-accesslevels.service';
import { PushNotificationService } from './push-notification.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'flujo dasboard';

  constructor(public dialog: MatDialog, private router: Router,
    public httpClient: HttpClient,
    private loginAuthService: LoginAuthService,
    private userAccesslevelsService: UserAccesslevelsService,
    private _notificationService: PushNotificationService
  ) {
      this._notificationService.requestPermission();
    if (this.loginAuthService.getCustomLoginStatus()) {
      this.router.navigate(['admin']);
    }
  }
  ngOnInit() {
  }
  openDialog(): void {
    _.delay(de => {
      const dialogRef = this.dialog.open(LogoutPopUpDialog, {
        width: '500px',
      });

      dialogRef.afterClosed().subscribe(result => {
        this.router.navigate(['/login']);
      });
    }, 1000);

  }

  // GET CLIENT FEATURE ACCESS LEVELS
  getClientFeatureAccessLevels = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.httpClient.get<ICommonInterface>(AppConstants.API_URL + 'flujo_client_getfat/' + AppConstants.CLIENT_ID).subscribe(
        succResp => {
          resolve(succResp);
        }, errResp => {
          console.log(errResp);
          resolve(errResp);
        }
      );
    });
  }

  // GET USER ACCESS LEVELS
  getClientUserAccessLevels = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      // tslint:disable-next-line:max-line-length
      this.httpClient.get<ICommonInterface>(AppConstants.API_URL + 'flujo_client_getuseraccessbyuserid/' + localStorage.getItem('user_id')).subscribe(
        succResp => {
          resolve(succResp);
        }, errResp => {
          resolve(errResp);
        }
      );
    });
  }


}


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-overview-example-dialog',
  templateUrl: './logout.popup.html',
})
// tslint:disable-next-line:component-class-suffix
export class LogoutPopUpDialog {

  constructor(
    public dialogRef: MatDialogRef<LogoutPopUpDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  onNoClick(): void {
    // this.dialogRef.close();
  }

  closeDailog() {
    this.dialogRef.close();

  }

}
