import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Component, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppConstants } from '../app.constants';
import { FilerepositoryComponent } from './filerepository.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NgxSmartLoaderService } from 'ngx-smart-loader';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AlertService } from 'ngx-alerts';
import { startWith } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'dialog-overview-example-dialog',
    templateUrl: 'filerepository.popup.html',
    styleUrls: ['./filerepository.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class FileRepositoryPopup {

    isImage: boolean;
    image_base64: string | ArrayBuffer;
    fileUploadForm: FormGroup;
    dialogform: FormControl;
    foldername: Observable<any[]>;
    foldersObject: any = this.data;
    client_id = AppConstants.CLIENT_ID;
    myControl: FormControl = new FormControl();
    file_name_control: FormControl = new FormControl();
    options = [];
    file_path;
    display_file_name: string;
    disable = true;
    filteredOptions: Observable<string[]>;
    folderObject = this.data;
    fileRepository: FilerepositoryComponent;
    formData = new FormData();
    // console.log(folderObject);
    constructor(
        public dialogRef: MatDialogRef<FileRepositoryPopup>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: FormBuilder,
        private httpClient: HttpClient,
        public loader: NgxSmartLoaderService,
        private spinnerService: Ng4LoadingSpinnerService,
        private alertService: AlertService,
        // private filerepositoryComponent: FilerepositoryComponent
    ) {
        this.isImage = false;
        this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            map(val => this.filter(val))
        );
        const folderObject = this.data;
        this.file_path = folderObject['file_path'];
        if (this.file_path) {
            this.display_file_name = this.file_path.name;
            const ext = this.file_path.name.toUpperCase().split('.').pop() || this.file_path.name;
            console.log(ext);
            if ((ext === 'PNG') || (ext === 'JPEG') || (ext === 'JPG')) {
                const reader = new FileReader();
                reader.readAsDataURL(this.file_path);
                reader.onload = () => {
                    // console.log(reader.result.split(',')[1]);
                    this.image_base64 = reader.result;
                    this.isImage = true;
                };
            }
        }
        delete folderObject['file_path'];
        this.options = folderObject;
        this.fileUploadForm = this.formBuilder.group({
            'file_name': ['', Validators.required],
            'folder': ['', Validators.required],
            'file_path': null,
            'client_id': null
        });
        // console.log(this.options);
    }

    filter(val: string): string[] {
        return this.options.filter(option => option.toLowerCase().indexOf(val.toLowerCase()) === 0);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
    closeDialog(): void {
        this.dialogRef.close();
    }

    submitForm = () => {
        this.fileUploadForm.controls['client_id'].setValue(this.client_id);
        this.fileUploadForm.controls['file_path'].setValue(this.file_path);
        this.fileUploadForm.controls['folder'].setValue(this.myControl.value);
        this.fileUploadForm.controls['file_name'].setValue(this.file_name_control.value);
        const formModel = this.fileUploadForm.value;

        this.formData.append('file_path', formModel.file_path);
        this.formData.append('file_name', formModel.file_name);
        this.formData.append('folder', formModel.folder);
        this.formData.append('client_id', formModel.client_id);
        if (this.fileUploadForm.invalid) {
            return false;
        } else if (formModel.file_name.match(/^[^a-zA-Z0-9]+$/) || formModel.folder.match(/^[^a-zA-Z0-9]+$/)) {
            return false;
        } else {
            this.dialogRef.close(this.fileUploadForm.value);
        }
    }
}
