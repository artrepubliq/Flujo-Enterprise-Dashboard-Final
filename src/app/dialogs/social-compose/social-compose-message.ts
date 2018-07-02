import { Inject, Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { IComposePost, IStreamDetails, IStreamComposeData } from '../../model/social-common.model';
import { AlertService } from 'ngx-alerts';
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'message-compose',
    templateUrl: 'social-compose-message.html',
    styleUrls: ['social-compose-message.scss']
})
// tslint:disable-next-line:component-class-suffix
export class MessageCompose implements OnInit {
    public maxSize = 4;
    public mediaFile: any;
    checkboxGroup: FormArray;
    doSchedule: boolean;
    postStatusForm: any;
    public errors: Array<string> = [];
    public date: Date = new Date();
    settings = {
        bigBanner: true,
        timePicker: true,
        format: 'yyyy-MM-dd hh:mm:ss',
        defaultOpen: false,
        closeOnSelect: true,
        rangepicker: false,
    };
    selectedStreamsArray: IStreamDetails[];
    constructor(
        public dialogRef: MatDialogRef<MessageCompose>,
        @Inject(MAT_DIALOG_DATA) public data: IComposePost[],
        private formBuilder: FormBuilder,
        private alertService: AlertService,
    ) {
        this.postStatusForm = this.formBuilder.group({
            'message': ['', Validators.compose([Validators.required])],
            'from_date': [new Date()],
            'to_date': [new Date()],
            'link': [''],
            'user_id': [localStorage.getItem('user_id')]
        });
        this.doSchedule = false;
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
        composedPostObject.name = stream.name;
        composedPostObject.access_token = stream.access_token;
        composedPostObject.imageUploadSuccessItem = [];
        composedPostObject.imageUploadFailedItem = [];
        composedPostObject.postStatus = false;
        composedPostObject.social_platform = stream.social_platform;
        this.selectedStreamsArray.push(composedPostObject);
    }
    public submitSocialPost(): void {
        let composedPostData: IStreamComposeData;
        composedPostData = <IStreamComposeData>{};
        composedPostData.streamDetails = this.selectedStreamsArray;
        composedPostData.composedMessage = this.postStatusForm.value;
        if (this.mediaFile !== undefined && this.errors.length === 0) {
            composedPostData.composedMessage.media = this.mediaFile;
        } else if (this.mediaFile === undefined || this.mediaFile === null) {
            // if media is not opted then setting the media value to an empty array.
            composedPostData.composedMessage.media = [];
        } else {
            return;
        }
        /** if scheduling isn't opted then settting from_date and to_date to undefined */
        if (this.doSchedule === false) {
            composedPostData.composedMessage.from_date = undefined;
            composedPostData.composedMessage.to_date = undefined;
        }
        if (composedPostData.streamDetails.length < 0) {
            this.alertService.warning('Please select at least one stream.');
        } else {
            this.dialogRef.close(composedPostData);
        }

        console.log(composedPostData);
    }

    public scheduleCheckBox(event): void {
        if (event.target.checked) {
            this.doSchedule = true;
        } else {
            this.doSchedule = false;
        }
        console.log(event.target.checked);
    }

    /**
     *
     * @param event takes input as file event
     */
    public onFileChange(event: any): void {
        console.log(event.target.files);
        if (event.target.files.length > 0) {
            this.mediaFile = Object.values(event.target.files);
            this.isValidFileSize(this.mediaFile);
            // console.log(this.errors);
        } else {
            this.mediaFile = undefined;
            console.log(this.mediaFile);
        }
    }

    /* this is for checking valid size of the file */
    private isValidFileSize(files: Array<any>) {
        files.map((file, index) => {
            const fileSizeinMB = file.size / (1024 * 1000);
            const size = Math.round(fileSizeinMB * 100) / 100; // convert upto 2 decimal place
            if (size > this.maxSize) {
                this.alertService.warning('Error (File Size): ' + file.name + ': exceed file size limit of '
                    + this.maxSize + 'MB ( ' + size + 'MB )');
                this.errors.push('Error (File Size): ' + file.name + ': exceed file size limit of '
                    + this.maxSize + 'MB ( ' + size + 'MB )');
            }
        });
    }
}
