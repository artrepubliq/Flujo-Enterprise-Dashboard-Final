import { Inject, Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { IComposePost, IStreamDetails, IStreamComposeData } from '../../model/social-common.model';
import { AlertService } from 'ngx-alerts';
import { IFBFeedArray, IProfile } from '../../model/facebook.model';
import { AppConstants } from '../../app.constants';
import { ICommonInterface } from '../../model/commonInterface.model';
import { HttpClient } from '@angular/common/http';
import { FacebookService } from 'ngx-facebook/dist/esm';
import { ITwitterTimelineObject } from '../../model/twitter/twitter.model';
@Component({
    selector: 'app-post-comment-twitter.dialog',
    templateUrl: 'post-comment-twitter.dialog.html',
    styleUrls: ['post-comment-twitter.dialog.scss']
})

// tslint:disable-next-line:component-class-suffix
export class PostCommentTwitterCompose implements OnInit {
    public errors: any;
    public maxSize = 4;
    public mediaFile: any;
    public postStatusForm: any;
    public selectedStreamsArray: IStreamDetails[];
    constructor(
        public dialogRef: MatDialogRef<PostCommentTwitterCompose>,
        @Inject(MAT_DIALOG_DATA) public data: ITwitterTimelineObject,
        private formBuilder: FormBuilder,
        private alertService: AlertService,

    ) {
        this.postStatusForm = this.formBuilder.group({
            'message': ['', Validators.compose([Validators.required])],
            'status_id': [this.data.id_str]
        });

    }

    ngOnInit(): void {
        console.log(this.data);
        this.selectedStreamsArray = [];
        const replyToUser = '@' + this.data.user.screen_name + ' ';
        this.postStatusForm.controls['message'].setValue(replyToUser);

    }

    onNoClick(): void {
        this.dialogRef.close();
    }
    closeDialog(): void {
        this.dialogRef.close();
    }

    public async submitSocialPost() {

        let composedPostData: IStreamComposeData;
        let composedPostObject: IStreamDetails;

        composedPostObject = <IStreamDetails>{};
        composedPostData = <IStreamComposeData>{};

        composedPostData.streamDetails = this.selectedStreamsArray;
        composedPostData.composedMessage = this.postStatusForm.value;

        composedPostObject.social_platform = 'twitter';
        this.selectedStreamsArray.push(composedPostObject);

        if (this.mediaFile !== undefined && this.errors.length === 0) {
            composedPostData.composedMessage.media = this.mediaFile;
            this.dialogRef.close(composedPostData);
        } else if (this.mediaFile === undefined || this.mediaFile === null) {
            this.dialogRef.close(composedPostData);
        }

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

    /**
     * this is for checking valid size of the file *
     * @param files this takes files object as a parameter to validate file
     */
    private isValidFileSize(files: Array<any>) {
        this.errors = '';
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
