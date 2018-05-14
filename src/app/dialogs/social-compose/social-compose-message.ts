import { Inject, Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ITwitterUserProfile, ITwitUser } from '../../model/twitter/twitter.model';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'message-compose',
    templateUrl: 'social-compose-message.html',
    styleUrls: ['social-compose-message.scss']
})
// tslint:disable-next-line:component-class-suffix
export class MessageCompose implements OnInit {
    doSchedule: true;
    constructor(
        public dialogRef: MatDialogRef<MessageCompose>,
        @Inject(MAT_DIALOG_DATA) public data: ITwitUser) { }

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnInit(): void {
        console.log(this.data);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    closeDialog(): void {
        this.dialogRef.close();
    }


}
