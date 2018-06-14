import { Inject, Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ITwitterUser, ITwitterUserProfile } from '../../model/twitter/twitter.model';
// import { IToPersonDetails } from '../../model/facebook.model';
import { Inject, Component } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IToPersonDetails } from '../../model/facebook.model';

@Component({
    selector: 'app-profile-info.dialog',
    templateUrl: 'profile-info.dialog.html',
    styleUrls: ['profile-info.dialog.scss']
})
// tslint:disable-next-line:component-class-suffix
export class ProfileInfoDialog implements OnInit {
    twitterplatform: boolean;
    twitProfileData: ITwitterUser | ITwitterUserProfile;
export class ProfileInfoDialog {
    constructor(
        public dialogRef: MatDialogRef<ProfileInfoDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
    }
    closeDialog() {
        this.dialogRef.close();
    }
    ngOnInit(): void {
        if (this.data.platform === 'twitter') {
            this.twitterplatform = true;
            this.twitProfileData = this.data.data;
            console.log(this.twitProfileData.favourites_count);
        } else {
            this.twitterplatform = false;
        }
        console.log(this.data);
    }
}
