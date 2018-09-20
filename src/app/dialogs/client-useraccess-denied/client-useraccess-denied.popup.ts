import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, Inject } from '@angular/core';
import { LoginAuthService } from '../../auth/login.auth.service';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'client-useriaccess-denied',
    templateUrl: 'client-useraccess-denied.popup.html',
    styleUrls: ['../../app.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class ClientUserAccessDenied {

    constructor(
        public dialogRef: MatDialogRef<ClientUserAccessDenied>, public loginAuthService: LoginAuthService,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        dialogRef.disableClose = true;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
    logoutUser() {
        this.dialogRef.close();
    }
}
