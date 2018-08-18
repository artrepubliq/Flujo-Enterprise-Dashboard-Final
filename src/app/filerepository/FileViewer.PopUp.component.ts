import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder } from '@angular/forms';

import { NgxSmartLoaderService } from 'ngx-smart-loader';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AlertService } from 'ngx-alerts';
import { HttpClient } from '@angular/common/http';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'fileviewer-dialog',
    templateUrl: 'fileviewer.popup.html',
    styleUrls: ['./filerepository.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class FileViewerPopUp {
    file_path: string;
    file_extension: string;
    file_name: string;
    constructor(
        public dialogRef: MatDialogRef<FileViewerPopUp>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        @Inject(MAT_DIALOG_DATA) public fileExtension: string,
        private formBuilder: FormBuilder,
        private httpClient: HttpClient,
        public loader: NgxSmartLoaderService,
        private spinnerService: Ng4LoadingSpinnerService,
        private alertService: AlertService,
        // private filerepositoryComponent: FilerepositoryComponent
    ) {
        console.log(this.data);
        console.log(this.data.file);
        console.log(this.data.file_extension);
        this.file_path = this.data.file;
        this.file_name = this.data.file_name;
        this.file_extension = this.data.file_extension.toLowerCase();
    }

    public closeWindow(): void {
        this.dialogRef.close();
    }
}
