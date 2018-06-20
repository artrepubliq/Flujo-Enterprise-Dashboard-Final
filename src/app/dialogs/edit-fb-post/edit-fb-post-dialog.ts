import { Inject, Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { IComposePost, IStreamDetails, IStreamComposeData } from '../../model/social-common.model';
import { AppConstants } from '../../app.constants';
import { IFBPages, IFBFeedArray } from '../../model/facebook.model';
import { AlertService } from 'ngx-alerts';
import { HttpClient } from '@angular/common/http';
import { ICommonInterface } from '../../model/commonInterface.model';
@Component({

    selector: 'app-edit-fbpost',
    templateUrl: 'edit-fb-post-dialog.html',
    styleUrls: ['edit-fb-post-dialog.scss']
})
// tslint:disable-next-line:component-class-suffix
export class EditFacebookMessage implements OnInit {
    errors = [];
    maxSize: number;
    mediaFile: any[];
    fullPicture: any;
    description: string;
    link: any;
    message: string;
    checkboxGroup: FormArray;
    doSchedule: true;
    uploadPhotosformData = new FormData();
    feedItem: IFBFeedArray;
    currentStreamDetails: any;
    constructor(
        private httpClient: HttpClient,
        private alertService: AlertService,
        public dialogRef: MatDialogRef<EditFacebookMessage>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: FormBuilder
    ) {

    }
    ngOnInit(): void {
        this.feedItem = this.data.postData;
        this.currentStreamDetails = this.data.streams;
        this.message = this.feedItem.message;
        this.link = this.feedItem.link && this.feedItem.description ? this.feedItem.link : '';
        this.description = this.feedItem.description ? this.feedItem.description : null;
        this.fullPicture = this.feedItem.full_picture ? this.feedItem.full_picture : null;
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
    closeDialog(): void {
        this.dialogRef.close();
    }
    public submitSocialPost = async () => {
        let composedPostData: IStreamComposeData;
        composedPostData = <IStreamComposeData>{};
        if (this.feedItem.message !== this.message ||
            (this.feedItem.link && this.feedItem.link !== this.link)) {
            this.feedItem.message = this.message;
            this.feedItem.link = this.link;
            let editPostObj: IComposePost;
            editPostObj = <IComposePost>{};
            editPostObj.message = this.message;
            composedPostData.streamDetails = Array(this.currentStreamDetails);
            composedPostData.streamDetails[0].post_id = this.feedItem.id;
            if (this.mediaFile && this.mediaFile.length > 0 && this.errors.length === 0 && !this.link) {
                try {
                    const successresp: ICommonInterface = await this.uploadFBPhotosToOurServer(this.mediaFile);
                    if (successresp.access_token && successresp.custom_status_code === 100 && !successresp.error ) {
                        editPostObj.media = successresp.result;
                        composedPostData.composedMessage = editPostObj;
                        composedPostData.streamDetails[0].imageUploadFailedItem = [];
                        composedPostData.streamDetails[0].imageUploadSuccessItem = [];
                        this.dialogRef.close(composedPostData);
                        this.clearAllObjects();
                    } else {
                        this.alertService.danger('Media is not uploaded. please try again...');
                    }
                } catch (err) {
                    this.alertService.danger('Media is not uploaded. please try again...');
                }
            } else {
                if (this.link) {editPostObj.link = this.link; }
                composedPostData.composedMessage = editPostObj;
                composedPostData.streamDetails = Array(this.currentStreamDetails);
                this.dialogRef.close(composedPostData);
                this.clearAllObjects();
            }
        }
    }

    // THIS FUNCTION IS FOR DELETE ALL THE OBJECTS.
    clearAllObjects = () => {
        this.feedItem = null;
        this.currentStreamDetails = null;
        this.message = null;
        this.link = null;
        this.description = null;
        this.fullPicture = null;
    }
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
    // THIS FUNCTION IS USED TO UPLOAD THE PHOTOS TO THE SERVER AND GET THE URL PATH OF THAT IMAGE
  uploadFBPhotosToOurServer = (media): Promise<any> => {
    return new Promise((resolve, reject) => {
        const uploadPhotosformData = new FormData();
        media.map(file => {
          uploadPhotosformData.append('images[]', file);
          });
          uploadPhotosformData.append('client_id', AppConstants.CLIENT_ID);
        // tslint:disable-next-line:max-line-length
        this.httpClient.post<ICommonInterface>('http://www.flujo.in/dashboard/flujo_staging/v1/flujo_client_postsocialimageupload', uploadPhotosformData)
        .subscribe(
           successresp => {
             console.log(successresp);
             resolve(successresp);
          }, errorrsp => {
            console.log(errorrsp);
            resolve(errorrsp);
        });
    });
    }
}
