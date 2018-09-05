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
import { IRepositories, IFiles, IResult } from '../model/repositories.model';
import * as _ from 'underscore';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { DeletefolderDialog } from '../filerepository/deletefolder.dialog';

import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AdminComponent } from '../admin/admin.component';
import { Router } from '@angular/router';
import { ICommonInterface } from '../model/commonInterface.model';
import { FileRepositoryPopup } from './filerepository.popup.component';
import { FileViewerPopUp } from './FileViewer.PopUp.component';

@Component({
    selector: 'app-filerepository',
    templateUrl: './filerepository.component.html',
    styleUrls: ['./filerepository.component.scss']
})

export class FilerepositoryComponent implements OnInit {
    toggleFileUploader = false;
    filteredUserAccessData: any;
    userAccessLevelObject: any;
    total_size: any;
    total_size_in_mb: any;
    fileName: any;
    ishide: boolean;
    FileUploadControl: FormGroup;
    errors: Array<string> = [];
    clickedFile: boolean;
    repositories: Array<IResult>;
    filtered_repositories: Array<IResult> = [];
    allFiles;
    dragAreaClass = 'dragarea';
    file_name: string;
    repository_name: string;
    uploaded_file: any;
    foldersdata = [];
    showInMb: boolean;
    showInKb: boolean;
    file_path: Object;

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
        public deleteFolderDialog: MatDialog,
        private alertService: AlertService,
        public adminComponent: AdminComponent,
        public router: Router) {
        this.FileUploadControl = this.formBuilder.group({
            'file_name': ['', Validators.required],
            'folder': ['', Validators.required],
            'file_path': null,
            'file_size': null
        });
        // this for restrict user on root access level
        if (this.adminComponent.userAccessLevelData) {
            this.userRestrict();
        } else {
            this.adminComponent.getUserAccessLevelsHttpClient()
                .subscribe(
                    resp => {
                        this.spinnerService.hide();
                        _.each(resp, item => {
                            if (item.user_id === localStorage.getItem('user_id')) {
                                this.userAccessLevelObject = item.access_levels;
                            } else {
                            }
                        });
                        this.adminComponent.userAccessLevelData = JSON.parse(this.userAccessLevelObject);
                        this.userRestrict();
                    },
                    error => {
                        console.log(error);
                        this.spinnerService.hide();
                    }
                );
        }
    }
    // this for restrict user on root access level
    userRestrict() {
        _.each(this.adminComponent.userAccessLevelData, (item, iterate) => {
            if (this.adminComponent.userAccessLevelData[iterate].name === 'Drive'
                && this.adminComponent.userAccessLevelData[iterate].enable) {
                this.filteredUserAccessData = item;
            } else {

            }
        });
        if (this.filteredUserAccessData) {
            this.router.navigate(['admin/filerepository']);
        } else {
            this.router.navigate(['/accessdenied']);
        }
    }
    /* this is when we submit the form */
    onSubmit(filedata) {

        this.spinnerService.show();
        const formData = new FormData();
        const fileSizeinMB = filedata.file_path.size / (1024 * 1000);
        const size = Math.round(fileSizeinMB * 100) / 100;
        formData.append('file_path', filedata.file_path);
        formData.append('folder', filedata.folder);
        formData.append('file_name', filedata.file_name);
        formData.append('client_id', filedata.client_id);
        formData.append('file_size', '' + filedata.file_path.size);

        console.log(size + parseFloat(this.total_size_in_mb));
        if ((size + parseFloat(this.total_size_in_mb)) >= 1024.00) {
            this.spinnerService.hide();
            this.alertService.warning('You have exceeded your limit 1 GB');
        } else {
            this.httpClient.post<ICommonInterface>(AppConstants.API_URL + 'flujo_client_postfilerepository', formData)
                .subscribe(
                    data => {
                        if (data.custom_status_code === 100 && data.result.length > 0) {
                            this.alertService.success('File uploaded successfully');
                            this.foldersdata = [];
                            console.log(data);
                            this.getFolders(AppConstants.CLIENT_ID);
                        } else if (data.custom_status_code === 101) {
                            this.alertService.warning('Required parameters are missing!');
                        } else if (data.custom_status_code === 102) {
                            this.alertService.warning('Every thing is upto date!');
                        }
                        this.spinnerService.hide();

                    },
                    error => {
                        console.log(error);
                    }
                );
        }
    }
    ngOnInit() {
        /* get folders by client Id */
        this.repositories = [];
        this.getFolders(AppConstants.CLIENT_ID);
    }

    /* this is used when a user changes the file or drops the file  */
    onFileChange(event) {
        const files = event.target.files;
        this.fileName = files;

        this.saveFiles(files);

        this.repositories.forEach(folders => this.foldersdata.push(folders.folder));

        if (this.errors.length === 0) {

            this.foldersdata['file_path'] = files[0];
            this.openDialog(this.foldersdata);
            event.target.value = null;
        }
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
            if ((result) && (result.file_name !== null) && (result.folder !== null) && (result.file_path !== null)) {
                this.onSubmit(result);
            }
        });
    }

    /* this is aa function to open a dialog modal to view file*/
    openViewDialog = (file, fileExtension, fileName) => {
        console.log(fileExtension);
        console.log(fileExtension.toLowerCase());

        if (fileExtension.toLowerCase() === 'png') {
            this.openFileViewDialog(file, fileExtension, fileName);

        } else if (fileExtension.toLowerCase() === 'jpeg') {
            this.openFileViewDialog(file, fileExtension, fileName);

        } else if (fileExtension.toLowerCase() === 'jpg') {
            this.openFileViewDialog(file, fileExtension, fileName);

        } else if (fileExtension.toLowerCase() === 'pdf') {

            this.openFileViewDialog(file, fileExtension, fileName);

        } else {
            this.alertService.warning('Sorry No preview available');
        }
    }


    /* this is to open the dialog modal of file view*/
    openFileViewDialog(file_data, file_extensison, fileName) {
        const dialogReference = this.fileViewDialog.open(FileViewerPopUp, {
            height: '95%',
            data: { file: file_data, file_extension: file_extensison, file_name: fileName }
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
        this.showInKb = false;
        this.showInMb = false;

        this.spinnerService.show();
        this.httpClient.get<ICommonInterface>(AppConstants.API_URL + 'flujo_client_getfilerepository/' + client_id)
            .subscribe(
                data => {
                    try {
                        if (data.result[1].result && data.result[0].size >= 0) {
                            this.allFiles = [];
                            this.repositories = data.result[1].result;
                            this.total_size = data.result[0].size;
                            this.total_size_in_mb = (this.total_size / 1048576).toFixed(2);
                            this.repositories.forEach(allFiles => {
                                this.allFiles.push(allFiles.files);
                            });
                            if (parseFloat((this.total_size / 1048576).toFixed(2)) >= 1.0) {
                                this.showInMb = true;
                                this.showInKb = false;
                            } else if (parseFloat((this.total_size / 1048576).toFixed(2)) < 1.0) {
                                this.showInMb = false;
                                this.showInKb = true;

                            }

                            this.filtered_repositories = [].concat.apply([], this.allFiles);
                            this.getFileSizes();
                        } else {
                            console.log(data);
                            this.repositories = [];
                        }
                        this.spinnerService.hide();
                    } catch (error) {
                        console.log(error);
                        this.spinnerService.hide();
                    }
                },
                error => {
                    this.spinnerService.hide();
                    console.log(error);
                }
            );
    }
    /* this is to get file sizes of each folder*/
    getFileSizes = () => {
        let size = 0;
        this.repositories.map((object) => {

            object.files.map((file) => {
                size = size + Number(file.file_size);
            });
            object['size'] = size;
            size = 0;
        });
    }
    /* this is for sorting folders */
    sortByFolderName = () => {
        this.repositories = _.sortBy(this.repositories, 'folder');
    }
    uploadFile() {
        this.toggleFileUploader = !this.toggleFileUploader;
    }
    sortByFolderNameDesc = () => {
        this.repositories.reverse();
    }
    /* this is to sort by size */
    sortBySize = () => {
        this.repositories = _.sortBy(this.repositories, 'size').reverse();
    }
    /* this is to append classes for file icon dynamically*/
    getClass = (fileExtension) => {
        console.log(fileExtension);
    }
    /* this is for getting documents*/
    getDocuments(repositories, folder_name, index) {
        this.resetIsactive(repositories);
        this.repositories[index].isActive = true;
        const files = repositories.filter(nerepositories => nerepositories.folder === folder_name);
        this.filtered_repositories = files[0].files;
        this.ConvertUnits();
    }

    ConvertUnits = () => {
        _.each(this.filtered_repositories, (filtered_item: IFiles) => {
            if (parseFloat((filtered_item.file_size / 1048576).toFixed(2)) >= 1.0) {
                filtered_item.isShowMb = true;
                filtered_item.isShowKb = false;
            } else if (parseFloat((filtered_item.file_size / 1048576).toFixed(2)) < 1.0) {
                filtered_item.isShowMb = false;
                filtered_item.isShowKb = true;
            }
        });
    }
    resetIsactive(repositories) {
        _.each(repositories, (iteratee, index) => {
            this.repositories[index].isActive = false;
        });
    }
    /* this is for deleting the documents*/
    deleteFile(id, repositories) {
        this.spinnerService.show();
        this.httpClient.delete<ICommonInterface>(AppConstants.API_URL + 'flujo_client_deletefilerepository/' + id)
            .subscribe(
                data => {
                    if (data.custom_status_code === 100) {
                        this.alertService.success('File deleted successfully');
                        this.filtered_repositories = [];
                        this.getFolders(AppConstants.CLIENT_ID);
                    } else if (data.custom_status_code === 101) {
                        this.alertService.warning('Required parameters are missing!');
                    } else if (data.custom_status_code === 102) {
                        this.alertService.warning('Every thing is upto date!');
                    }
                    this.spinnerService.hide();
                },
                error => {
                    this.alertService.warning('something went wrong');
                    console.log(error);
                }
            );
    }

    // this is to open dialog when clicked on delete folder icon
    public deleteFolder(repositoryitem) {
        console.log(repositoryitem);
        if (repositoryitem.files.length === 0) {

            this.deleteFoldersAndFiles(repositoryitem.folder_id);
        } else {
            console.log(repositoryitem);
            const delFolderdialog = this.deleteFolderDialog.open(DeletefolderDialog, {
                width: '420px'
            });

            delFolderdialog.afterClosed().subscribe(result => {
                console.log('The dialog was closed');

                if (result === true) {
                    this.deleteFoldersAndFiles(repositoryitem.folder_id);
                } else {
                    console.log('i cannot');
                }
            });
        }
    }

    deleteFoldersAndFiles(folderId) {
        console.log(folderId);
        this.spinnerService.show();
        this.httpClient.delete<ICommonInterface>(AppConstants.API_URL + 'flujo_client_deleterepositories/' + folderId)
            .subscribe(
                data => {
                    if (data.custom_status_code === 100) {
                        this.alertService.success('Folder deleted successfully');
                        this.filtered_repositories = [];
                        this.getFolders(AppConstants.CLIENT_ID);
                    } else if (data.custom_status_code === 101) {
                        this.alertService.warning('Required parameters are missing!');
                    } else if (data.custom_status_code === 102) {
                        this.alertService.warning('Every thing is upto date!');
                    }
                    this.spinnerService.hide();

                },
                error => {
                    this.spinnerService.hide();
                    this.alertService.warning('something went wrong');
                    console.log(error);
                }
            );
    }
}
