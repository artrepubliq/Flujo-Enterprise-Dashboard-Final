import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AlertModule, AlertService } from 'ngx-alerts';
import * as _ from 'underscore';
import { ColorPickerModule, ColorPickerDirective } from 'ngx-color-picker';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AppConstants } from '../app.constants';
import { IHttpResponse } from '../model/httpresponse.model';
import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { IModuleDetails } from '../model/accessLevel.model';
import { AdminComponent } from '../admin/admin.component';
import { Router } from '@angular/router';
import { AccessDataModelComponent } from '../model/useraccess.data.model';
import { ICommonInterface } from '../model/commonInterface.model';
import 'styles.scss';
@Component({
    selector: 'app-create-module',
    templateUrl: './create-module.component.html',
    styleUrls: ['./create-module.component.scss']
})
export class CreateModuleComponent implements OnInit {
    filteredUserAccessData: any;
    userAccessLevelObject: any;
    childDetails: any;
    ttt: any;
    moduleForm: FormGroup;

    isEdit = false;
    isAddPage = false;
    isTableView = false;
    isGridView = true;
    loading = false;
    button_text = 'Save';
    decodedString: string;
    dialog: any;
    public parentPageDetails;
    public moduleDetails: object;
    public module_description = '';
    public app_description = '';
    bgColor = '#3c3c3c';
    dummy: string;
    @ViewChild('fileInput') fileInput: ElementRef;
    userAccessDataModel: AccessDataModelComponent;
    feature_id = '20';
    constructor(private spinnerService: Ng4LoadingSpinnerService, private formBuilder: FormBuilder, private httpClient: HttpClient,
        private alertService: AlertService, public adminComponent: AdminComponent, private router: Router) {
        this.createForm();
        this.getModuleDetails();
        if (Number(localStorage.getItem('feature_id') !== this.feature_id)) {
        this.userAccessDataModel = new AccessDataModelComponent(httpClient, router);
        this.userAccessDataModel.setUserAccessLevels(null, this.feature_id, 'admin/module');
    }
    }
    ngOnInit() {
        setTimeout(function () {
            this.spinnerService.hide();
        }.bind(this), 3000);
    }
    createForm = () => {
        this.moduleForm = this.formBuilder.group({
            module_name: ['', Validators.required],
            module_title: ['', Validators.required],
            module_description: ['', Validators.required],
            module_background_color: [''],
            module_background_image: null,
            client_id: null,
            module_id: [null]
        });
    }

    onModuleBackgroundImageChange = (event) => {
        const reader = new FileReader();
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.moduleForm.get('module_background_image').setValue(
                    reader.result.split(',')[1]
                );
            };
        }
    }
    onSubmit = (body) => {
        this.spinnerService.show();
        const formModel = this.moduleForm.value;
        this.spinnerService.show();
        this.moduleForm.controls['client_id'].setValue(localStorage.getItem('client_id'));
        if (!body.module_id) {
            this.moduleForm.controls['module_id'].setValue('null');
        }
        this.httpClient.post<ICommonInterface>(AppConstants.API_URL + 'flujo_client_postmodule', this.moduleForm.value)
            .subscribe(
                data => {
                    if (AppConstants.ACCESS_TOKEN === data.access_token) {
                        if (data.custom_status_code === 100) {
                            this.alertService.success('Data updated successfully');
                            this.parsePostResponse(data);
                        } else if (data.custom_status_code === 101) {
                            this.alertService.warning('Required parameters are missing!');
                        } else if (data.custom_status_code === 102) {
                            this.alertService.warning('Every thing is upto date!');
                        }
                    }
                    // if (data.error) {
                    //     this.alertService.warning(data.result);
                    //     // this.parsePostResponse(data);
                    //     this.spinnerService.hide();
                    // } else {
                    //     this.getModuleDetails();
                    //     this.parsePostResponse(data);
                    //     this.spinnerService.hide();
                    // }


                },
                error => {
                    this.loading = false;
                    this.spinnerService.hide();
                });
    }

    clearFile = (id) => {
        this.moduleForm.get('component_image').setValue(null);
        this.fileInput.nativeElement.value = '';
    }
    onDelete = (body) => {
        const formModel = body.id;
        this.spinnerService.show();
        this.httpClient.delete<ICommonInterface>(AppConstants.API_URL + 'flujo_client_deletemodule/' + formModel)
            .subscribe(
                data => {
                    this.moduleDetails = null;
                    if (AppConstants.ACCESS_TOKEN === data.access_token) {
                        if (data.custom_status_code === 100) {
                            this.alertService.success('Data deleted successfully');
                        } else if (data.custom_status_code === 101) {
                            this.alertService.warning('Required parameters are missing!');
                        }
                    }
                    this.getModuleDetails();
                    this.spinnerService.hide();
                    this.loading = false;
                },
                error => {
                    this.loading = false;
                    this.spinnerService.hide();
                    this.alertService.success('Something went wrong');
                });
    }
    getModuleDetails = () => {
        this.spinnerService.show();
        this.httpClient.get<ICommonInterface>(AppConstants.API_URL + 'flujo_client_getmodule/' + AppConstants.CLIENT_ID)
            .subscribe(
                data => {
                    this.moduleDetails = null;
                        if (data.custom_status_code === 100 && !data.error) {
                            this.moduleDetails = data.result;
                            console.log(this.moduleDetails);
                        } else if (data.custom_status_code === 101) {

                        }
                    this.isEdit = false;
                    this.spinnerService.hide();
                },
                error => {
                    // console.log(error);
                    this.loading = false;
                    this.spinnerService.hide();
                }
            );
    }
    // this method is used to update page detals to the form, if detalis exist
    setDefaultClientPageDetails = (moduleData) => {
        if (moduleData) {
            this.moduleForm.controls['module_name'].setValue(moduleData.module_name);
            this.moduleForm.controls['module_title'].setValue(moduleData.module_title);
            this.moduleForm.controls['module_id'].setValue(moduleData.id);
            this.moduleForm.controls['module_description'].setValue(moduleData.module_description);
            // this.moduleForm.controls['component_image'].setValue(moduleData.component_image);
            this.moduleForm.controls['module_background_image'].setValue(moduleData.module_background_image);
            this.moduleForm.controls['module_background_color'].setValue(moduleData.module_background_color);
            // this.dummy = moduleData.parent_id;
            // console.log(this.moduleForm.value);
        }

    }
    addPages = () => {
        this.moduleForm.reset();
        this.isEdit = true;
        this.isAddPage = true;
        this.isTableView = false;
        this.isGridView = false;
    }
    viewPages = () => {
        // this.getModuleDetails();
        this.isEdit = false;
        this.isGridView = false;
        this.isTableView = true;

    }
    viewPagesGrid = () => {
        this.isEdit = false;
        this.isTableView = false;
        this.isGridView = true;
    }
    editCompnent = (moduleItem) => {
        // this.alertService.success('page updated successfull.');
        this.isEdit = true;
        this.isTableView = false;
        this.isGridView = false;
        this.button_text = 'Update';
        this.setDefaultClientPageDetails(moduleItem);
    }
    parsePostResponse(response) {
        this.alertService.success('request completed successfully.');
        this.loading = false;
        this.moduleForm.reset();
        this.isEdit = false;
        this.isGridView = true;
        this.button_text = 'Save';
        this.getModuleDetails();
    }
    cancelFileEdit() {
        this.isEdit = false;
        this.isGridView = true;
    }
}
