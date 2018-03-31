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
import { IModuleDetails } from '../model/accessLevel.model';
import { AdminComponent } from '../admin/admin.component';
import { Router } from '@angular/router';

@Component({
    // selector: 'app-create-module',
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
    constructor(private spinnerService: Ng4LoadingSpinnerService, private formBuilder: FormBuilder, private httpClient: HttpClient,
        private alertService: AlertService, public adminComponent: AdminComponent, private router: Router) {
        this.createForm();
        this.getModuleDetails();
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
                    }else {
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
    }
    ngOnInit() {
        setTimeout(function () {
            this.spinnerService.hide();
        }.bind(this), 3000);
    }
    userRestrict() {
        _.each(this.adminComponent.userAccessLevelData, (item, iterate) => {
            // tslint:disable-next-line:max-line-length
            if (this.adminComponent.userAccessLevelData[iterate].name === 'Biography' && this.adminComponent.userAccessLevelData[iterate].enable) {
                this.filteredUserAccessData = item;
                console.log('huu');
            } else {
                // this.router.navigate(['/accessdenied']);
                // console.log('else');
            }
        });
        if (this.filteredUserAccessData) {
            this.router.navigate(['/module']);
        } else {
            this.router.navigate(['/accessdenied']);
            console.log('else');
        }
    }
    createForm = () => {
        this.moduleForm = this.formBuilder.group({
            module_name: ['', Validators.required],
            module_title: ['', Validators.required],
            module_description: ['', Validators.required],
            module_background_color: ['', ],
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
        this.httpClient.post<IHttpResponse>(AppConstants.API_URL + 'flujo_client_postmodule', this.moduleForm.value)
            .subscribe(
                data => {
                    if (data.error) {
                        this.alertService.warning(data.result);
                        // this.parsePostResponse(data);
                        this.spinnerService.hide();
                    } else {
                        this.getModuleDetails();
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
        this.moduleForm.get('component_image').setValue(null);
        this.fileInput.nativeElement.value = '';
    }
    onDelete = (body) => {
        const formModel = body.id;
        this.spinnerService.show();
        this.httpClient.delete(AppConstants.API_URL + 'flujo_client_deletemodule/' + formModel)
            .subscribe(
                data => {
                    this.getModuleDetails();
                    this.spinnerService.hide();
                    this.moduleDetails = null;
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
    getModuleDetails = () => {
        this.spinnerService.show();
        this.httpClient.get<IModuleDetails>(AppConstants.API_URL + 'flujo_client_getmodule/' + AppConstants.CLIENT_ID)
            .subscribe(
                data => {
                    this.moduleDetails = null;
                    this.isEdit = false;
                    this.moduleDetails = data;
                    console.log(this.moduleDetails);
                    this.spinnerService.hide();
                },
                error => {
                    console.log(error);
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
            console.log(this.moduleForm.value);
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
