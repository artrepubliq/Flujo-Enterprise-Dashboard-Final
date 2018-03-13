import { Component, OnInit, Input, Output, EventEmitter, HostListener, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { FileUploadModule } from 'ng2-file-upload';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../app.constants';
import { NgxSmartLoaderService } from 'ngx-smart-loader';
import { AlertService } from 'ngx-alerts';
import { IHttpResponse } from '../model/httpresponse.model';
import { RequestOptions, Headers } from '@angular/http';
import { IRepositories } from '../model/repositories.model';
import * as _ from 'underscore';
import { FileHolder } from 'angular2-image-upload';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';

import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
    selector: 'app-filerepository',
    templateUrl: './filerepository.component.html',
    styleUrls: ['./filerepository.component.scss']
})

export class FilerepositoryComponent implements OnInit {
    fileName: any;
    ishide: boolean;
    FileUploadControl: FormGroup;
    errors: Array<string> = [];
    clickedFile: boolean;
    repositories: Array<IRepositories> = [];
    filtered_repositories: Array<IRepositories> = [];
    allFiles = [];
    dragAreaClass = 'dragarea';
    file_name: string;
    repository_name: string;
    uploaded_file: any;
    foldersdata = [];

    // disabled = false;
    @Input() projectId: number;
    @Input() sectionId: number;
    @Input() fileExt = 'JPG, PDF, PNG, JPEG, CSV, DOCX, DOC';
    @Input() maxFiles = 1;
    @Input() maxSize = 2; // 5MB
    @Output() uploadStatus = new EventEmitter();

    constructor(
        private formBuilder: FormBuilder,
        private httpClient: HttpClient,
        public loader: NgxSmartLoaderService,
        private spinnerService: Ng4LoadingSpinnerService,
        public dialog: MatDialog,
        public fileViewDialog: MatDialog,
        private alertService: AlertService) {

        this.FileUploadControl = this.formBuilder.group({
            'file_name': ['', Validators.required],
            'folder': ['', Validators.required],
            'file_path': null,
            'file_size': null
        });

    }

    /* this is when we submit the form */
    onSubmit(filedata) {
        // const fileData = this.FileUploadControl.value;
        // fileData.client_id = AppConstants.CLIENT_ID;
        // console.log(fileData);
        const formData = new FormData();
        formData.append('file_path', filedata.file_path);
        formData.append('folder', filedata.folder);
        formData.append('file_name', filedata.file_name);
        formData.append('client_id', filedata.client_id);
        // formData.append('file_size', filedata.file_size);
        this.spinnerService.show();

        this.httpClient.post<IHttpResponse>(AppConstants.API_URL + 'flujo_client_postfilerepository', formData)
            .subscribe(
                data => {
                    // console.log(data);
                    if (data.error) {
                        this.alertService.warning(data.result);
                        // console.log(data);
                        this.spinnerService.hide();
                    } else {
                        this.alertService.success('File uploaded successfully');
                        this.spinnerService.hide();
                        this.foldersdata = [];
                        this.getFolders(AppConstants.CLIENT_ID);
                    }
                },
                error => {
                    console.log(error);
                }
            );
    }
    ngOnInit() {
        /* get folders by client Id */
        this.getFolders(AppConstants.CLIENT_ID);
    }

    /* this is used when a user changes the file or drops the file  */
    onFileChange(event) {
        const files = event.target.files;
        this.fileName = files;
        // console.log(files.name);
        this.saveFiles(files);
        console.log(this.repositories);
        this.repositories.forEach(folders => this.foldersdata.push(folders.folder));
        // console.log(this.errors);
        if (this.errors.length === 0) {
            console.log(this.foldersdata);
            this.foldersdata['file_path'] = files[0];
            this.openDialog(this.foldersdata);
        }
    }
    onRemoved(file: FileHolder) {
        this.ishide = true;
        // do some stuff with the removed file.
    }
    onUploadStateChanged(state: boolean) {
        console.log(JSON.stringify(state));
    }
    @HostListener('dragover', ['$event']) onDragOver(event) {
        this.dragAreaClass = 'droparea';
        event.preventDefault();
    }

    @HostListener('dragenter', ['$event']) onDragEnter(event) {
        this.dragAreaClass = 'droparea';
        event.preventDefault();
    }

    @HostListener('dragend', ['$event']) onDragEnd(event) {
        this.dragAreaClass = 'dragarea';
        event.preventDefault();
    }

    @HostListener('dragleave', ['$event']) onDragLeave(event) {
        this.dragAreaClass = 'dragarea';
        event.preventDefault();
    }
    @HostListener('drop', ['$event']) onDrop(event) {
        this.dragAreaClass = 'dragarea';
        event.preventDefault();
        event.stopPropagation();
        const files = event.dataTransfer.files;
        this.saveFiles(files);
        this.repositories.forEach(folders => this.foldersdata.push(folders.folder));
        // console.log(this.foldersdata);
        if (this.errors.length === 0) {
            this.foldersdata['file_path'] = files[0];
            this.openDialog(this.foldersdata);
        }
    }

    /* this is an event listener whenever a file is being changed */
    saveFiles(files) {
        this.errors = []; // Clear error
        // Validate file size and allowed extensions

        if (files.length > 0 && (!this.isValidFiles(files))) {
            this.uploadStatus.emit(false);
            return;
        }
        const fileSizeinMB = files[0].size / (1024 * 1000);
        const size = Math.round(fileSizeinMB * 100) / 100;
        // console.log(fileSizeinMB);
        // console.log(size);
        this.FileUploadControl.controls['file_path'].setValue(files[0]);
        this.foldersdata['file_path'] = files[0];
        this.FileUploadControl.controls['file_size'].setValue(size);
    }
    /** this is dialog form for file and folder name*/
    openDialog(repositories): void {
        const dialogRef = this.dialog.open(FileRepositoryPopup, {
            width: '50vw',
            data: repositories,
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            this.foldersdata = [];
            if ((result) && (result.file_name  !== null) && (result.folder !== null) && (result.file_path !== null)) {
                this.onSubmit(result);
            }
        });
    }

    /* this is aa function to open a dialog modal to view file*/
    openViewDialog = (file, fileExtension, fileName) => {
        console.log(fileExtension);
        console.log(fileExtension.toLowerCase());
        // console.log(file);
        if (fileExtension.toLowerCase() === 'png') {
            this.openFileViewDialog(file, fileExtension, fileName);
            // return;
        } else if (fileExtension.toLowerCase() === 'jpeg') {
            this.openFileViewDialog(file, fileExtension, fileName);
            // return;
        } else if (fileExtension.toLowerCase() === 'jpg') {
            this.openFileViewDialog(file, fileExtension, fileName);
            // return;
        } else if (fileExtension.toLowerCase() === 'pdf') {

            this.openFileViewDialog(file, fileExtension, fileName);
            // return;
        } else {
            this.alertService.warning('Sorry No preview available');
        }
    }


    /* this is to open the dialog modal of file view*/
    openFileViewDialog(file_data, file_extensison, fileName) {
        const dialogReference = this.fileViewDialog.open(FileViewerPopUp, {
          height: '95%',
          data: {file: file_data, file_extension: file_extensison, file_name: fileName}
        });
        dialogReference.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
      }


    /* this is for checking for the maximum number of files */
    private isValidFiles(files) {
        // Check Number of files
        if (files.length > this.maxFiles) {
            this.alertService.warning('Error: At a time you can upload only ' + this.maxFiles + ' files');
            this.errors.push('Error: At a time you can upload only ' + this.maxFiles + ' files');
            return;
        }
        this.isValidFileExtension(files);
        // return this.errors.length === 0;
    }

    /* this is for checking the valid extension of files*/
    private isValidFileExtension(files) {
        // Make array of file extensions
        const extensions = (this.fileExt.split(','))
            .map(function (x) { return x.toLocaleUpperCase().trim(); });

        for (let i = 0; i < files.length; i++) {
            // Get file extension
            const ext = files[i].name.toUpperCase().split('.').pop() || files[i].name;
            // Check the extension exists
            const exists = extensions.includes(ext);
            if (!exists) {
                this.alertService.warning('Error (Extension): ' + files[i].name);
                this.errors.push('Error (Extension): ' + files[i].name);
                return;
            }
            // Check file size
            this.isValidFileSize(files[i]);
        }
    }

    /* this is for checking valid size of the file */
    private isValidFileSize(file) {
        const fileSizeinMB = file.size / (1024 * 1000);
        const size = Math.round(fileSizeinMB * 100) / 100; // convert upto 2 decimal place
        if (size > this.maxSize) {

            this.alertService.warning('Error (File Size): ' + file.name + ': exceed file size limit of '
                + this.maxSize + 'MB ( ' + size + 'MB )');
            this.errors.push('Error (File Size): ' + file.name + ': exceed file size limit of '
                + this.maxSize + 'MB ( ' + size + 'MB )');
        }
    }
    /* this is to get Folders by client id*/
    getFolders(client_id) {
        console.log(client_id);
        this.httpClient.get<Array<IRepositories>>(AppConstants.API_URL + 'flujo_client_getfilerepository/' + client_id)
            .subscribe(
                data => {
                    this.allFiles = [];
                    this.spinnerService.hide();
                    this.repositories = data;
                    console.log(this.repositories);
                    this.repositories.forEach(allFiles => {
                        this.allFiles.push(allFiles.files);
                     });
                     this.filtered_repositories = [].concat.apply([], this.allFiles);
                     console.log(this.allFiles);
                },
                error => {
                    console.log(error);
                }
            );
    }
    /* this is for sorting folders */
    sortByFolderName = () => {
       this.repositories =  _.sortBy(this.repositories, 'folder');
    }
    /* this is to sort by size */
    sortBySize = () => {
        this.repositories = _.sortBy(this.repositories, 'files');
    }
    /* this is for getting documents*/
    getDocuments(repositories, folder_name, index) {
        this.resetIsactive(repositories);
        this.repositories[index].isActive = true;
        const files = repositories.filter(nerepositories => nerepositories.folder === folder_name);
        this.filtered_repositories = files[0].files;
        console.log(this.filtered_repositories);
    }
    resetIsactive(repositories) {
        _.each(repositories, (iteratee, index) => {
            this.repositories[index].isActive = false;
        });
    }
    /* this is for deleting the documents*/
    deleteFile(id, repositories) {
        this.spinnerService.show();
        this.httpClient.delete<Array<IRepositories>>(AppConstants.API_URL + 'flujo_client_deletefilerepository/' + id)
            .subscribe(
                data => {
                    this.spinnerService.hide();
                    this.alertService.success('File deleted successfully');
                    this.filtered_repositories = [];
                    this.getFolders(AppConstants.CLIENT_ID);
                },
                error => {
                    this.alertService.success('File something went wrong successfully');
                    console.log(error);
                }
            );
    }
}
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'dialog-overview-example-dialog',
    templateUrl: 'filerepository.popup.html',
    styleUrls: ['./filerepository.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class FileRepositoryPopup {

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
        this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            map(val => this.filter(val))
        );
        const folderObject = this.data;
        this.file_path = folderObject['file_path'];
        if (this.file_path) {
            this.display_file_name = this.file_path.name;
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
        } else {
            this.dialogRef.close(this.fileUploadForm.value);
        }
    }
}

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'fileviewer-dialog',
    templateUrl: 'fileviewer.popup.html',
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
        this.file_path = 'http://' + this.data.file;
        this.file_name = this.data.file_name;
        this.file_extension = this.data.file_extension.toLowerCase();
    }
  }
