import { Component, ElementRef, ViewChild, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AlertModule, AlertService } from 'ngx-alerts';
import * as _ from 'underscore';
import { ColorPickerModule, ColorPickerDirective } from 'ngx-color-picker';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AppConstants } from '../app.constants';
import { IHttpResponse } from '../model/httpresponse.model';
import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { GalleryImagesService } from '../service/gallery-images.service';
import { MediaDetail } from '../model/feedback.model';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, _MatProgressSpinnerMixinBase } from '@angular/material';
import { ICommonInterface } from '../model/commonInterface.model';
import grapesjs from 'grapesjs';
declare var grapesjs: any;
@Component({
    templateUrl: './pages.component.html',
    styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit, OnDestroy {
    appEditor: boolean;
    webEditor: boolean;
    popUpImageData1: any;
    popUpImageData: any;
    filteredUserAccessData: any;
    userAccessLevelObject: any;
    imagesOfgallery: MediaDetail[];
    childDetails: any;
    ttt: any;
    form: FormGroup;
    highlightStatus: Array<boolean> = [];
    isEdit = false;
    isAddPage = false;
    isTableView = false;
    isGridView = true;
    loading = false;
    button_text = 'Save';
    decodedString: string;
    public parentPageDetails;
    public pageDetails: object;
    public web_description = '';
    public app_description = '';
    bgColor = '#3c3c3c';
    feature_id = 1;
    dummy: string;
    @ViewChild('fileInput1') fileInput1: ElementRef;
    @ViewChild('fileInput2') fileInput2: ElementRef;
    webDescription: any;
    editedContent: any;
    constructor(private spinnerService: Ng4LoadingSpinnerService, private formBuilder: FormBuilder, private httpClient: HttpClient,
        private alertService: AlertService, private galleryImagesService: GalleryImagesService, public dialog: MatDialog,
        private router: Router) {
        this.createForm();
        this.getPageDetails();
        if (localStorage.getItem('editor_source') === 'editorWeb') {
            this.webEditor = true;
        }
        if (localStorage.getItem('editor_source') === 'editorApp') {
            this.appEditor = true;
        }
        if (localStorage.getItem('editor_source')) {
            this.router.navigate(['admin/pages']);
        } else {
            // this.router.navigate(['admin/chooseplatform']);
        }
        // this.getGalleryImageData();
    }
    ngOnInit() {
        setTimeout(function () {
            this.spinnerService.hide();
        }.bind(this), 3000);
    }
    // getGalleryImageData = () => {
    //     this.galleryImagesService.getGalleryImagesComponent('flujo_client_getgallery/', AppConstants.CLIENT_ID)
    //         .subscribe(
    //             data => {
    //                 if (data.custom_status_code === 100 && !data.error) {
    //                     this.imagesOfgallery = data.result;
    //                     console.log(this.imagesOfgallery);
    //                 } else if (data.custom_status_code === 101 && data.error) {
    //                     this.alertService.warning('Required parameters are missing');
    //                 }
    //             },
    //             error => {
    //                 console.log(error);
    //             }
    //         );
    // }
    createForm = () => {
        this.form = this.formBuilder.group({
            component_name: ['', Validators.required],
            component_menuname: ['', null],
            parent_id: null,
            web_description: ['', Validators.required],
            app_description: ['', Validators.required],
            component_background_color: [''],
            component_order: ['', Validators.required],
            component_id: null,
            component_image: null,
            component_background_image: null,
            client_id: null
        });
    }

    onComponentImageChange = (event) => {
        const reader = new FileReader();
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.form.get('component_image').setValue(
                    reader.result.split(',')[1]
                );
            };
        }
    }
    onComponentBackgroundImageChange = (event) => {
        const reader = new FileReader();
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.form.get('component_background_image').setValue(
                    reader.result.split(',')[1]
                );
            };
        }
    }
    openDialog(imageType): void {
        const dialogRef = this.dialog.open(MediaLocalImagePopupDialog, {
            width: '70vw',
            height: '70vh',
            data: { images: this.imagesOfgallery, image_Type: imageType }
        });
        // console.log(this.imagesOfgallery);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                // console.log(result);
                if (result.imageType === 'backgroundImage') {
                    this.popUpImageData = result.image;
                } else {
                    this.popUpImageData1 = result.image;
                }
            }
        });
        this.highlightStatus = [false];
    }
    onSubmit = (body) => {
        this.spinnerService.show();
        this.form.get('component_image').setValue(this.popUpImageData1);
        this.form.get('component_background_image').setValue(this.popUpImageData);
        this.form.get('web_description').setValue(this.editedContent);
        const formModel = this.form.value;
        this.spinnerService.show();
        this.form.controls['client_id'].setValue(localStorage.getItem('client_id'));
        if (!body.component_id) {
            this.form.controls['component_id'].setValue('null');
        }
        if (!this.form.value.parent_id) {
            this.form.controls['parent_id'].setValue('-1');
        }
        this.httpClient.post<ICommonInterface>(AppConstants.API_URL + 'flujo_client_postcomponent', this.form.value)
            .subscribe(
                data => {
                    if ((!data.error) && (data.custom_status_code === 100)) {
                        this.getPageDetails();
                        this.parsePostResponse(data.result);
                        this.spinnerService.hide();
                    } else if (data.error && (data.custom_status_code === 101)) {
                        this.spinnerService.hide();
                        this.alertService.warning('Required parameters are missing');
                    } else if (data.error && (data.custom_status_code === 132)) {
                        this.spinnerService.hide();
                        this.alertService.warning('Page order is already existed');
                    }
                    this.spinnerService.hide();
                },
                error => {
                    this.loading = false;
                    this.spinnerService.hide();
                });
    }

    clearFile = (id) => {
        if (id === 1) {
            this.form.get('component_image').setValue(null);
            this.fileInput1.nativeElement.value = '';
        } else {
            this.form.get('component_background_image').setValue(null);
            this.fileInput2.nativeElement.value = '';
        }
    }
    onDelete = (body) => {
        // const formModel = this.form.value;
        this.spinnerService.show();
        const component_id = body.id;
        this.httpClient.delete<ICommonInterface>(AppConstants.API_URL + 'flujo_client_deletecomponent/' + component_id)
            .subscribe(
                data => {
                    if ((!data.error) && (data.custom_status_code = 100)) {
                        this.getPageDetails();
                        this.spinnerService.hide();
                        this.pageDetails = null;
                        console.log(data);
                        this.loading = false;
                        this.alertService.success('Page delete successfully');
                    } else if ((data.error) && (data.custom_status_code = 101)) {
                        this.alertService.danger('Required parameters are missing');
                    }
                },
                error => {
                    this.loading = false;
                    this.spinnerService.hide();
                    this.alertService.success('Something went wrong');
                });
    }
    getPageDetails = () => {
        this.spinnerService.show();
        this.httpClient.get<ICommonInterface>(AppConstants.API_URL + 'flujo_client_getcomponent/' + AppConstants.CLIENT_ID)
            .subscribe(
                data => {
                    this.parentPageDetails = null;
                    this.pageDetails = null;
                    this.isEdit = false;
                    this.pageDetails = data.result;
                    this.parentPageDetails = _.filter(this.pageDetails, (parentData) => {
                        return parentData.parent_id === '-1';
                    });
                    this.childDetails = _.filter(this.pageDetails, (parentData) => {
                        return parentData.parent_id !== '-1';
                    });
                    this.spinnerService.hide();
                },
                error => {
                    // console.log(error);
                    this.loading = false;
                    this.spinnerService.hide();
                }
            );
    }
    getChild(childData) {
        this.childDetails = _.filter(this.pageDetails, (parentData) => {
            return parentData.parent_id === JSON.stringify(childData.id);
        });
        // console.log(this.childDetails);
    }
    // this method is used to set page detals to the form, if detalis exist

    setDefaultClientPageDetails = (pageData) => {
        if (pageData) {
            // this.button_text = "Update";
            this.webDescription = pageData.web_description;
            this.form.controls['component_id'].setValue(pageData.id);
            this.form.controls['component_name'].setValue(pageData.component_name);
            this.form.controls['component_menuname'].setValue(pageData.component_menuname);
            this.form.controls['web_description'].setValue(pageData.web_description);
            this.form.controls['app_description'].setValue(pageData.app_description);
            this.form.controls['component_image'].setValue(pageData.component_image);
            if (pageData) {
                this.bgColor = pageData.component_background_color;
            }
            this.form.controls['component_background_image'].setValue(pageData.component_background_image);
            this.form.controls['component_background_color'].setValue(pageData.component_background_color);
            this.form.controls['component_order'].setValue(pageData.component_order);
            this.form.controls['parent_id'].setValue(pageData.parent_id);
            this.dummy = pageData.parent_id;
            console.log(this.form.value);
        }

    }
    addPages = () => {
        this.form.reset();
        this.isEdit = true;
        this.isAddPage = true;
        this.isTableView = false;
        this.isGridView = false;
        this.button_text = 'save';
    }
    viewPages = () => {
        // this.getPageDetails();
        this.isEdit = false;
        this.isGridView = false;
        this.isTableView = true;

    }
    viewPagesGrid = () => {
        this.isEdit = false;
        this.isTableView = false;
        this.isGridView = true;
    }
    editCompnent = (componentItem) => {
        // this.alertService.success('page updated successfull.');
        this.isEdit = true;
        this.isTableView = false;
        this.isGridView = false;
        this.button_text = 'Update';
        this.setDefaultClientPageDetails(componentItem);
    }
    parsePostResponse(response) {
        this.alertService.success('request completed successfully.');
        this.loading = false;
        this.form.reset();
        this.isEdit = false;
        this.isGridView = true;
        this.button_text = 'Save';
        this.getPageDetails();
    }
    cancelFileEdit() {
        this.isEdit = false;
        this.isGridView = true;
    }
    ngOnDestroy() {
        if (this.dialog) {
            this.dialog = null;
        }
    }

    edittedData = (event) => {
        // console.log(event);
        this.editedContent = event;
    }
}
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'media-localimagepopup.html',
    templateUrl: 'media-localimagepopup.html',
    styleUrls: ['./pages.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class MediaLocalImagePopupDialog {
    isActive: boolean;
    total_images: Array<MediaDetail>;
    filteredLocalImages: object;
    constructor(
        public dialogRef: MatDialogRef<MediaLocalImagePopupDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        dialogRef.disableClose = true;
        //   _.each(this.data, index => {
        //       console.log(this.data[index]);
        //   });
        this.total_images = data.images;
        this.total_images.map(imageData => {
            imageData.isActive = false;
            // console.log(imageData);
        });
    }
    closeDialog(): void {
        this.dialogRef.close(this.filteredLocalImages);
    }
    cancelDialog(): void {
        this.dialogRef.close();
    }
    getLocalImageId(localImageData, index) {
        this.total_images.map(imageData => {
            imageData.isActive = false;
            // console.log(imageData);
        });
        localImageData.isActive = true;
        this.filteredLocalImages = { image: this.total_images[index].image, imageType: this.data.image_Type };
        // console.log(this.filteredLocalImages);
    }
}
