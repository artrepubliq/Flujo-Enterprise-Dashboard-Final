import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, Inject } from '@angular/core';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'media-delete-popup',
    templateUrl: 'media-delete.popup.html',
})
// tslint:disable-next-line:component-class-suffix
export class MediaDeletePopup {

    constructor(
        public dialogRef: MatDialogRef<MediaDeletePopup>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
