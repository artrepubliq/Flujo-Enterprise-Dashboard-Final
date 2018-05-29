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
    doSchedule: boolean;
    postStatusForm: any;
    // format: 'LT';
    // pickTime: true;
    // startDate =  moment('2015-11-18T00:00Z');
    // endDate = moment('2015-11-20T00:00Z');
    // startOptions: any = {format: 'YYYY-MM-DD'};
    // endOptions: any = {format: 'YYYY-MM-DD'};
    // public startDate: any = new Date();
    public date: Date = new Date();
    // settings = {
    //     bigBanner: true,
    //     timePicker: true,
    //     format: 'dd-MM-yyyy hh:mm',
    //     defaultOpen: false,
    //     closeOnSelect: true,
    //     rangepicker: false,
    //     clickOutside: false
    // };
    settings = {
        bigBanner: true,
        timePicker: true,
        format: 'dd-MM-yyyy hh:mm',
        defaultOpen: false,
        closeOnSelect: true,
        rangepicker: false,
    };
    selectedStreamsArray: IStreamDetails[];
    constructor(
        public dialogRef: MatDialogRef<MessageCompose>,
        @Inject(MAT_DIALOG_DATA) public data: IComposePost[],
        private formBuilder: FormBuilder
    ) {
        this.postStatusForm = this.formBuilder.group({
            'message': ['', Validators.compose([Validators.required])],
        });
        this.doSchedule = false;
        // this.checkboxGroup = new FormArray(this.data.map(item => new FormGroup({
        //     id: new FormControl(item.key),
        //     text: new FormControl(item.text),
        //     checkbox: new FormControl(false)
        //   })));
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

    public scheduleCheckBox(event): void {
        if (event.target.checked) {
            this.doSchedule = true;
        } else {
            this.doSchedule = false;
        }
        console.log(event.target.checked);
    }
    // public update() {
    //     this.startOptions.maxDate = this.endDate;
    //     this.endOptions.minDate = this.startDate;
    //   }

    // public onStartDateChange(date) {
    //     this.startDate = Date;
    //     this.startDate = new Date(this.startDate.toISOString());
    // }
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
