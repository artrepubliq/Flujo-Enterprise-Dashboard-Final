import { Inject, Component } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-social-addstreem-dialog',
    templateUrl: 'social-addstreem.dialog.html',
    styleUrls: ['social-addstreem.dialog.scss']
})
// tslint:disable-next-line:component-class-suffix
export class AddSocialStreemDialog {
    twitter: any;
    facebookData: any;
    selectedPage: string;
    selectedStream: string;
    constructor(
        public dialogRef: MatDialogRef<AddSocialStreemDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any[]) {
        data.forEach((item) => {
            if (item.social_platform === 'facebook') {
                this.facebookData = item;
            }
        });


    }

    onNoClick(): void {
        this.dialogRef.close();
    }
    changeClient = (event) => {
        this.selectedPage = event;
    }
    selectStream = (item) => {
        this.selectedStream = item;
    }
    closeDialog() {
        this.facebookData = [];
        this.dialogRef.close(this.selectedPage);
    }


}
