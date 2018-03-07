import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
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
@Component({
    selector: 'app-filerepository',
    templateUrl: './filerepository.component.html',
    styleUrls: ['./filerepository.component.scss']
})

export class FilerepositoryComponent implements OnInit {
    FileUploadControl: FormGroup;
    errors: Array<string> = [];
    clickedFile: boolean ;
    repositories: Array<IRepositories> = [];
    filtered_repositories: Array<IRepositories> = [];
    dragAreaClass = 'dragarea';
    file_name: string;
    repository_name: string;
    uploaded_file: any;
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
        private alertService: AlertService) {

        this.FileUploadControl = this.formBuilder.group({
            'file_name': ['', Validators.required],
            'folder': ['', Validators.required],
            'file_path': null,
            'file_size': null
        });

    }

    /* this is when we submit the form */
    onSubmit() {
        const fileData = this.FileUploadControl.value;
        fileData.client_id = AppConstants.CLIENT_ID;
        console.log(fileData);
        const formData = new FormData();
        formData.append('file_path', fileData.file_path);
        formData.append('folder', fileData.folder);
        formData.append('file_name', fileData.file_name);
        formData.append('client_id', fileData.client_id);
        formData.append('file_size', fileData.file_size);
        this.spinnerService.show();

        this.httpClient.post<IHttpResponse>(AppConstants.API_URL + 'flujo_client_postfilerepository', formData)
            .subscribe(
                data => {
                    console.log(data);
                    if (data.error) {
                        this.alertService.warning(data.result);
                        console.log(data);
                        this.spinnerService.hide();
                    } else {
                        this.alertService.success('File uploaded successfully');
                        this.spinnerService.hide();

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
        console.log(files);
        this.saveFiles(files);
        console.log(this.FileUploadControl.invalid);
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
    }

    /* this is an event listener whenever a file is being changed */
    saveFiles(files) {
        this.errors = []; // Clear error
        // Validate file size and allowed extensions

        if (files.length > 0 && (!this.isValidFiles(files))) {
            this.uploadStatus.emit(false);
            return;
        }
        //   console.log(files);
        const fileSizeinMB = files[0].size / (1024 * 1000);
        const size = Math.round(fileSizeinMB * 100) / 100;
        console.log(fileSizeinMB);
        console.log(size);
        this.FileUploadControl.controls['file_path'].setValue(files[0]);
        this.FileUploadControl.controls['file_size'].setValue(size);
    }

    /* this is for checking for the maximum number of files */
    private isValidFiles(files) {
        // Check Number of files
        if (files.length > this.maxFiles) {
            this.alertService.warning('Error: At a time you can upload only ' + this.maxFiles + ' files');
            // this.errors.push("Error: At a time you can upload only " + this.maxFiles + " files");
            return;
        }
        this.isValidFileExtension(files);
        return this.errors.length === 0;
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
    // console.log(this.FileUploadControl.valid);
    // this is to disable submit button
    disable() {
        // console.log(this.disabled);
        // console.log(this.FileUploadControl.valid);
        // return false;
        // console.log(this.errors);
        // console.log(this.FileUploadControl.controls['file_path'].value);
        if ((this.FileUploadControl.valid === true) && (this.errors.length === 0) &&
            (this.FileUploadControl.controls['file_path'].value) != null) {
            return false;
        } else {
            return true;
        }
    }

    /* this is to get Folders by client id*/
    getFolders(client_id) {
        this.httpClient.get<Array<IRepositories>>(AppConstants.API_URL + 'flujo_client_getfilerepository/' + client_id)
            .subscribe(
                data => {
                    this.repositories = data;
                    console.log(this.repositories);
                },
                error => {
                    console.log(error);
                }
            );
    }
    /* this is for getting documents*/
    getDocuments(repositories, folder_name, index) {
        console.log(index);
        this.resetIsactive(repositories);
        this.repositories[index].isActive = true;
        // console.log(folder);
        // console.log(repositories);
        const newFolders = repositories.filter(nerepositories => nerepositories.folder === folder_name);
        console.log(newFolders);
        this.filtered_repositories = newFolders;
        // const newFolders = repositories.filter(nerepositories =>{
        //     if (nerepositories.folder === folder_name) {
        //         return nerepositories;
        //     }
        // });
    }
    resetIsactive(repositories) {
        _.each(repositories, (iteratee, index) =>{
            this.repositories[index].isActive = false;
        });
    }
    /* this is for deleting the documents*/
    deleteFile(id, client_id, repositories) {
        this.spinnerService.show();
        this.httpClient.delete<Array<IRepositories>>(AppConstants.API_URL + 'flujo_client_deletefilerepository/' + id)
            .subscribe(
                data => {
                    this.spinnerService.hide();
                    this.getFolders(client_id);
                    const newFolders = repositories.filter(newFiles => newFiles.id !== id);
                    console.log(newFolders);
                    this.filtered_repositories = newFolders;
                    this.alertService.success('File deleted successfully');
                    console.log(data);
                },
                error => {
                    this.alertService.success('File something went wrong successfully');
                    console.log(error);
                }
            );
    }

    /* image upload files styles */
    customStyle = {
        selectButton: {
            'border-radius': '20px',
            'background-color': '#ee286b',
            'box-shadow': '0 1.5px 18px 0 rgba(0, 0, 0, 0.15)',
            'font-size': '14px',
            'font-weight': '500',
            'text-align': 'center',
            'color': '#ffffff',
            'text-transform': 'initial',
            'font-family': 'Roboto',
            'width': '130px',
            'height': '40px',
            'float': 'right'
        },
        clearButton: {
            'border-radius': '20px',
            'background-color': '#ee286b',
            'box-shadow': '0 1.5px 18px 0 rgba(0, 0, 0, 0.15)',
            'font-size': '14px',
            'font-weight': '500',
            'text-align': 'center',
            'color': '#ffffff',
            'text-transform': 'initial',
            'font-family': 'Roboto',
            'width': '130px',
            'height': '40px',
            'float': 'right'
        },
        layout: {
            'border-radius': '5px',
            'background-color': 'transparent',
            'border': 'dashed 1.5px #91d7ea'
        },
        previewPanel: {
            'background-color': 'transparent',
            'border-radius': '0 0 25px 25px',
        },
        dropBoxMessage: {
            'font-family': 'Roboto',
            'font-size': '15px',
            'font-weight': '500',
            'text-align': 'center',
            'color': 'red',
            'display': 'none'
        },

    };
}