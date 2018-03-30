import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-deletefolder',
    templateUrl: 'deletefolder.dialog.html',
})
// tslint:disable-next-line:component-class-suffix
export class DeletefolderDialog {

    constructor(
        public dialogRef: MatDialogRef<DeletefolderDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }
    onNoClick(): void {
        this.dialogRef.close(false);
    }

    cancel(): void {
        this.dialogRef.close(false);
    }
    deleteFolder(): void {
        this.dialogRef.close(true);
    }

}
