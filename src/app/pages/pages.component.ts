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
import { mediaDetail } from '../model/feedback.model';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { AdminComponent } from '../admin/admin.component';
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
    imagesOfgallery: mediaDetail[];
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

    dummy: string;
    @ViewChild('fileInput1') fileInput1: ElementRef;
    @ViewChild('fileInput2') fileInput2: ElementRef;
    constructor(private spinnerService: Ng4LoadingSpinnerService, private formBuilder: FormBuilder, private httpClient: HttpClient,
        private alertService: AlertService, private galleryImagesService: GalleryImagesService, public dialog: MatDialog,
        private router: Router, public adminComponent: AdminComponent) {
        this.createForm();
        this.getPageDetails();
        if (this.adminComponent.userAccessLevelData) {
            console.log(this.adminComponent.userAccessLevelData[0].name);
            this.userRestrict();
        } else {
            this.adminComponent.getUserAccessLevelsHttpClient()
                .subscribe(
                    resp => {
                        console.log(resp);
                        this.spinnerService.hide();
                        _.each(resp, item => {
                            if (item.user_id === localStorage.getItem('user_id')) {
                                this.userAccessLevelObject = item.access_levels;
                            } else {
                                // this.userAccessLevelObject = null;
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
        if (localStorage.getItem('editor_source') === 'editorWeb') {
            this.webEditor = true;
        }
        if (localStorage.getItem('editor_source') === 'editorApp') {
            this.appEditor = true;
        }
        if (localStorage.getItem('editor_source')) {
            this.router.navigate(['admin/pages']);
        } else {
            this.router.navigate(['admin/chooseplatform']);
        }
    }
    ngOnInit() {
        setTimeout(function () {
            this.spinnerService.hide();
        }.bind(this), 3000);
        this.galleryImagesService.getGalleryImagesComponent('/flujo_client_getgallery/', AppConstants.CLIENT_ID)
            .subscribe(
                data => {
                    this.imagesOfgallery = data;
                    console.log(this.imagesOfgallery);
                },
                error => {
                    console.log(error);
                }
            );
    }
    userRestrict() {
        _.each(this.adminComponent.userAccessLevelData, (item, iterate) => {
            // tslint:disable-next-line:max-line-length
            if (this.adminComponent.userAccessLevelData[iterate].name === 'Editor' && this.adminComponent.userAccessLevelData[iterate].enable) {
                this.filteredUserAccessData = item;
            } else {
                // this.router.navigate(['/accessdenied']);
                // console.log('else');
            }
        });
        if (this.filteredUserAccessData) {
            this.router.navigate(['admin/pages']);
        } else {
            this.router.navigate(['/accessdenied']);
            console.log('else');
        }
    }
    createForm = () => {
        this.form = this.formBuilder.group({
            component_name: ['', Validators.required],
            component_menuname: ['', null],
            parent_id: null,
            web_description: ['', Validators.required],
            app_description: ['', Validators.required],
            component_background_color: ['', ],
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
    /* This is popup for image selection */
    openDialog(imageType): void {
        const dialogRef = this.dialog.open(MediaLocalImagePopupDialog, {
            width: '70vw',
            height: '70vh',
            data: { images: this.imagesOfgallery, image_Type: imageType }
        });
        console.log(this.imagesOfgallery);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                console.log(result);
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
        const formModel = this.form.value;
        this.spinnerService.show();
        this.form.controls['client_id'].setValue(localStorage.getItem('client_id'));
        if (!body.component_id) {
            this.form.controls['component_id'].setValue('null');
        }
        if (!this.form.value.parent_id) {
            this.form.controls['parent_id'].setValue('-1');
        }
        this.httpClient.post<IHttpResponse>(AppConstants.API_URL + 'flujo_client_postcomponent', this.form.value)
            .subscribe(
                data => {
                    if (data.error) {
                        this.alertService.warning(data.result);
                        this.spinnerService.hide();
                    } else {
                        this.getPageDetails();
                        this.parsePostResponse(data);
                        this.spinnerService.hide();
                    }

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
        this.spinnerService.show();
        const component_id = body.id;
        this.httpClient.delete(AppConstants.API_URL + 'flujo_client_deletecomponent/' + component_id)
            .subscribe(
                data => {
                    this.getPageDetails();
                    this.spinnerService.hide();
                    this.pageDetails = null;
                    console.log(data);
                    this.loading = false;
                    this.alertService.success('Page delete successfully');
                },
                error => {
                    this.loading = false;
                    this.spinnerService.hide();
                    this.alertService.success('Something went wrong');
                });
    }
    getPageDetails = () => {
        this.spinnerService.show();
        this.httpClient.get(AppConstants.API_URL + 'flujo_client_getcomponent/' + AppConstants.CLIENT_ID)
            .subscribe(
                data => {
                    this.parentPageDetails = null;
                    this.pageDetails = null;
                    this.isEdit = false;
                    this.pageDetails = data;
                    this.parentPageDetails = _.filter(this.pageDetails, (parentData) => {
                        return parentData.parent_id === '-1';
                    });
                    this.childDetails = _.filter(this.pageDetails, (parentData) => {
                        return parentData.parent_id !== '-1';
                    });
                    this.spinnerService.hide();
                },
                error => {
                    console.log(error);
                    this.loading = false;
                    this.spinnerService.hide();
                }
            );
    }
    getChild(childData) {
        this.childDetails = _.filter(this.pageDetails, (parentData) => {
            return parentData.parent_id === childData.id;
        });
        console.log(this.childDetails);
    }
    // this method is used to set page detals to the form, if detalis exist

    setDefaultClientPageDetails = (pageData) => {
        if (pageData) {
            // this.button_text = "Update";
            this.form.controls['component_id'].setValue(pageData.id);
            this.form.controls['component_name'].setValue(pageData.component_name);
            this.form.controls['component_menuname'].setValue(pageData.component_menuname);
            this.form.controls['web_description'].setValue(pageData.web_description);
            this.form.controls['app_description'].setValue(pageData.app_description);
            this.form.controls['component_image'].setValue(pageData.component_image);
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
    total_images: Array<mediaDetail>;
    filteredLocalImages: object;
    constructor(
        public dialogRef: MatDialogRef<MediaLocalImagePopupDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        dialogRef.disableClose = true;
        this.total_images = data.images;
        this.total_images.map(imageData => {
            imageData.isActive = false;
        });
    }
    /* Here we send the selected image string to form in page component */
    closeDialog(): void {
        this.dialogRef.close(this.filteredLocalImages);
    }
    cancelDialog(): void {
        this.dialogRef.close();
    }
    /* This method is used to get selected image from popup in component image selection*/
    getLocalImageId(localImageData, index) {
        this.total_images.map(imageData => {
            imageData.isActive = false;
        });
        localImageData.isActive = true;
        this.filteredLocalImages = { image: this.total_images[index].image, imageType: this.data.image_Type };
        console.log(this.filteredLocalImages);
    }
}
