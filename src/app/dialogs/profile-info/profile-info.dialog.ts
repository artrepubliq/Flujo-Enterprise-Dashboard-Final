import { Inject, Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ITwitterUser, ITwitterUserProfile } from '../../model/twitter/twitter.model';
import { IToPersonDetails } from '../../model/facebook.model';

@Component({
    selector: 'app-profile-info.dialog',
    templateUrl: 'profile-info.dialog.html',
    styleUrls: ['profile-info.dialog.scss']
})
// tslint:disable-next-line:component-class-suffix
export class ProfileInfoDialog implements OnInit {
    facebookData: any;
    twitterplatform: boolean;
    twitProfileData: ITwitterUser | ITwitterUserProfile;
    constructor(
        public dialogRef: MatDialogRef<ProfileInfoDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
    }
    closeDialog() {
        this.twitProfileData = null;
        this.twitterplatform = null;
        this.facebookData = null;
        this.dialogRef.close();
    }
    ngOnInit(): void {
        if (this.data.platform === 'twitter') {
            this.twitterplatform = true;
            this.twitProfileData = this.data.data;
            console.log(this.twitProfileData.favourites_count);
        } else if (this.data && this.data.key) {
            this.twitterplatform = false;
            this.facebookData = this.data;
        }
        console.log(this.data);
    }
}
