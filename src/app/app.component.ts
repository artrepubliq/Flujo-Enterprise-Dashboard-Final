import { Component, Inject, OnInit, EventEmitter } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { LoginAuthService } from './auth/login.auth.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import * as _ from 'underscore';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl : './app.component.html',
  styleUrls : ['./app.component.scss']
})
export class AppComponent {
  title = 'flujo dasboard';

  constructor(public dialog: MatDialog, private router: Router,
     private loginAuthService: LoginAuthService) {
}

  openDialog(): void {
    _.delay(de => {
      const dialogRef = this.dialog.open(LogoutPopUpDialog, {
        width: '500px',
      });

      dialogRef.afterClosed().subscribe(result => {
        this.router.navigate(['/login']);
      });
    } , 1000);

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
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    // this.dialogRef.close();
  }

  closeDailog() {
    this.dialogRef.close();

  }

}
