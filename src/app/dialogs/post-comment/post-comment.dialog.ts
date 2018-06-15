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
@Component({
    selector: 'app-post-comment.dialog',
    templateUrl: 'post-comment.dialog.html',
    styleUrls: ['post-comment.dialog.scss']
})
// tslint:disable-next-line:component-class-suffix
export class PostCommentCompose {
    errors: any;
    public maxSize = 4;
    public mediaFile: any;
    postStatusForm: any;
    profileData: IProfile;
    postDetils: IFBFeedArray;
    streamDetails: IStreamDetails;
    constructor(
        public dialogRef: MatDialogRef<PostCommentCompose>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: FormBuilder,
        private alertService: AlertService,
        private httpClient: HttpClient,
        private fb: FacebookService
    ) {
        this.postStatusForm = this.formBuilder.group({
            'message': ['', Validators.compose([Validators.required])],
            'media': null,
        });
        console.log(data);
        this.postDetils = data.postDetails;
        this.profileData = data.profile;
        // this.streamDetails = data.currentStream;
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
    closeDialog(): void {
        this.dialogRef.close();
    }
    public async submitSocialPost() {
        if (this.mediaFile !== undefined && this.errors.length === 0) {
        try {
            const res: any =  await this.uploadFBPhotosToOurServer(this.mediaFile);
            if (res.access_token && res.custom_status_code === 100 && !res.error ) {
                this.postStatusForm.controls['media'].setValue(res.result);
                this.dialogRef.close(this.postStatusForm.value);
                }
        } catch (err) {
            console.log(err);
        }

        } else if (this.mediaFile === undefined || this.mediaFile === null) {
            this.dialogRef.close(this.postStatusForm.value);
            console.log(this.postStatusForm);
        } else {
            return;
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

    /* this is for checking valid size of the file */
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

// THIS FUNCTION IS USED TO UPLOAD THE PHOTOS TO THE SERVER AND GET THE URL PATH OF THAT IMAGE
uploadFBPhotosToOurServer = (media) => {
    return new Promise((resolve, reject) => {
        const uploadPhotosformData = new FormData();
        media.map(file => {
          uploadPhotosformData.append('images[]', file);
          });
          uploadPhotosformData.append('client_id', AppConstants.CLIENT_ID);
        // tslint:disable-next-line:max-line-length
        this.httpClient.post<ICommonInterface>('http://www.flujo.in/dashboard/flujo_staging/v1/flujo_client_postsocialimageupload', uploadPhotosformData).subscribe(
           successresp => {
               resolve(successresp);
          }, errorrsp => {
            console.log(errorrsp);
            reject(errorrsp);
          });
    });
  }
}
