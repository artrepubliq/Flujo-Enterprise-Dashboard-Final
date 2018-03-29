import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AlertModule, AlertService } from 'ngx-alerts';
import * as _ from 'underscore';
import { ColorPickerModule, ColorPickerDirective } from 'ngx-color-picker';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AppConstants } from '../app.constants';
import { IHttpResponse } from '../model/httpresponse.model';
import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

@Component({
    templateUrl: './pages.component.html',
    styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit, OnDestroy {
    childDetails: any;
    ttt: any;
    form: FormGroup;

    isEdit = false;
    isAddPage = false;
    isTableView = false;
    isGridView = true;
    loading = false;
    button_text = 'Save';
    decodedString: string;
    dialog: any;
    public parentPageDetails;
    public pageDetails: object;
    public web_description = '';
    public app_description = '';

    bgColor= '#3c3c3c';

    dummy: string;
    @ViewChild('fileInput1') fileInput1: ElementRef;
    @ViewChild('fileInput2') fileInput2: ElementRef;
    constructor(private spinnerService: Ng4LoadingSpinnerService, private formBuilder: FormBuilder, private httpClient: HttpClient,
    private alertService: AlertService) {
        this.createForm();
        this.getPageDetails();
    }
    ngOnInit() {
        setTimeout(function() {
            this.spinnerService.hide();
          }.bind(this), 3000);
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
    onSubmit = (body) => {
        this.spinnerService.show();
        const formModel = this.form.value;
        this.spinnerService.show();
        this.form.controls['client_id'].setValue(localStorage.getItem('client_id'));
        if (!body.component_id) {
            this.form.controls['component_id'].setValue('null');
        }
        if (!this.form.value.parent_id) {
            this.form.controls['parent_id'].setValue('-1');
        }
        this.httpClient.post<IHttpResponse>( AppConstants.API_URL + 'flujo_client_postcomponent', this.form.value)
            .subscribe(
            data => {
                if (data.error) {
                    this.alertService.warning(data.result);
                    // this.parsePostResponse(data);
                    this.spinnerService.hide();
                }else {
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
        }else {
        this.form.get('component_background_image').setValue(null);
        this.fileInput2.nativeElement.value = '';
        }
    }
    onDelete = (body) => {
        // const formModel = this.form.value;
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
        this.httpClient.get( AppConstants.API_URL + 'flujo_client_getcomponent/' + AppConstants.CLIENT_ID)
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
}
