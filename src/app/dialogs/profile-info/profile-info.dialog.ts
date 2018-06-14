import { Inject, Component } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IToPersonDetails } from '../../model/facebook.model';

@Component({
    selector: 'app-profile-info.dialog',
    templateUrl: 'profile-info.dialog.html',
    styleUrls: ['profile-info.dialog.scss']
})
// tslint:disable-next-line:component-class-suffix
export class ProfileInfoDialog {
    constructor(
        public dialogRef: MatDialogRef<ProfileInfoDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
    }
    closeDialog() {
        this.dialogRef.close();
    }


}
