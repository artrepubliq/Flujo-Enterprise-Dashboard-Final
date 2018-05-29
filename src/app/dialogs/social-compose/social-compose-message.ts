import { Inject, Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { IComposePost, IStreamDetails, IStreamComposeData } from '../../model/social-common.model';
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'message-compose',
    templateUrl: 'social-compose-message.html',
    styleUrls: ['social-compose-message.scss']
})
// tslint:disable-next-line:component-class-suffix
export class MessageCompose implements OnInit {
    public mediaFile: any;
    checkboxGroup: FormArray;
    doSchedule: true;
    postStatusForm: any;
    selectedStreamsArray: IStreamDetails[];
    constructor(
        public dialogRef: MatDialogRef<MessageCompose>,
        @Inject(MAT_DIALOG_DATA) public data: IComposePost[],
        private formBuilder: FormBuilder
    ) {
        this.postStatusForm = this.formBuilder.group({
            'message': ['', Validators.compose([Validators.required])],
        });
    }
    ngOnInit(): void {
        this.selectedStreamsArray = [];
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
    closeDialog(): void {
        this.dialogRef.close();
    }
    public onCheckEvent(stream: IStreamDetails): void {
        let composedPostObject: IStreamDetails;
        composedPostObject = <IStreamDetails>{};
        composedPostObject.social_id = stream.social_id;
        composedPostObject.id = stream.id;
        composedPostObject.screen_name = stream.screen_name;
        composedPostObject.access_token = stream.access_token;
        composedPostObject.social_platform = stream.social_platform ? stream.social_platform : '';
        this.selectedStreamsArray.push(composedPostObject);
    }
    public submitSocilPost(): void {
        let composedPostData: IStreamComposeData;
        composedPostData = <IStreamComposeData>{};
        composedPostData.streamDetails = this.selectedStreamsArray;
        composedPostData.composedMessage = this.postStatusForm.value;
        if (this.mediaFile !== undefined) {
            composedPostData.composedMessage.media = this.mediaFile;
        }
        this.dialogRef.close(composedPostData);
        console.log(composedPostData);
    }

    /**
     *
     * @param event takes input as file event
     */
    public onFileChange(event: any): void {
        console.log(event.target.files);
        if (event.target.files.length > 0) {
            this.mediaFile = event.target.files;
        } else {
            this.mediaFile = undefined;
            console.log(this.mediaFile);
        }
    }
}
