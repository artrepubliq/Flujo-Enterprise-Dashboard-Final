import { Inject, Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { IComposePost, IStreamDetails, IStreamComposeData } from '../../model/social-common.model';
import { AppConstants } from '../../app.constants';
import { IFBPages, IFBFeedArray } from '../../model/facebook.model';
@Component({

    selector: 'app-edit-fbpost',
    templateUrl: 'edit-fb-post-dialog.html',
    styleUrls: ['edit-fb-post-dialog.scss']
})
// tslint:disable-next-line:component-class-suffix
export class EditFacebookMessage implements OnInit {
    link: any;
    message: string;
    checkboxGroup: FormArray;
    doSchedule: true;
    uploadPhotosformData = new FormData();
    feedItem: IFBFeedArray;
    currentStreamDetails: IFBPages;
    constructor(
        public dialogRef: MatDialogRef<EditFacebookMessage>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: FormBuilder
    ) {

    }
    ngOnInit(): void {
        this.feedItem = this.data.postData;
        this.currentStreamDetails = this.data.streams;
        this.message = this.feedItem.message;
        this.link = this.feedItem.link;
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
    closeDialog(): void {
        this.dialogRef.close();
    }
    public submitSocialPost(): void {
        console.log(this.message);
        this.feedItem.message = this.message;
        this.feedItem.link = this.link;
        let editPostObj: {'postData': IFBFeedArray, 'streams': IFBPages};
        editPostObj = <any>{};
        editPostObj.postData = this.feedItem;
        editPostObj.streams = this.currentStreamDetails;
        this.dialogRef.close(editPostObj);
    }
    selectMedia(event) {
        if (event.target.files && event.target.files.length > 0) {
          let uploadImages: any[];
          const files = event.target.files;
          uploadImages = Object.values(files);
          uploadImages.map(file => {
          this.uploadPhotosformData.append('images[]', file);
          });
          this.uploadPhotosformData.append('client_id', AppConstants.CLIENT_ID);
        }
      }
}
