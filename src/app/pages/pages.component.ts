import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from '@angular/common/http';
import { AlertModule, AlertService } from 'ngx-alerts';
import * as _ from 'underscore';
import { ColorPickerModule,ColorPickerDirective } from 'ngx-color-picker';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AppConstants } from '../app.constants';
@Component({
    templateUrl: './pages.component.html',
    styleUrls: ['./pages.component.scss']
})
export class PagesComponent {
    form: FormGroup;
    isEdit: boolean = false;
    loading: boolean = false;
    button_text: string = "save";
    decodedString: string;
    dialog: any;
    public parentPageDetails;
    public pageDetails: object;
    public web_description: string = '';
    public app_description: string = '';

    dummy: string;
    @ViewChild('fileInput') fileInput: ElementRef;
    
    constructor(private spinnerService: Ng4LoadingSpinnerService,private formBuilder: FormBuilder, private httpClient: HttpClient, private alertService: AlertService) {
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
            component_menuname: ['',null],
            component_parent: null,
            web_description: ['', Validators.required],
            app_description: ['', Validators.required],
            component_background_color:['',],
            component_order: ['', Validators.required],
            component_id: null,
            component_image: null,
            component_background_image: null,
            client_id: null
        });
    }

    onComponentImageChange = (event) => {
        let reader = new FileReader();
        if (event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.form.get('component_image').setValue(
                    reader.result.split(',')[1]
                )
            };
        }
    }
    onComponentBackgroundImageChange = (event) =>{
        let reader = new FileReader();
        if (event.target.files && event.target.files.length > 0) {
            let file = event.target.files[0];
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.form.get('component_background_image').setValue(
                    reader.result.split(',')[1]
                )
            };
        }
    }
   
    onSubmit = (body) => {
        this.spinnerService.show();
        const formModel = this.form.value;
        this.spinnerService.show();
        this.form.controls['client_id'].setValue(localStorage.getItem("client_id"));
        if(!body.component_id){
            this.form.controls['component_id'].setValue("null");
        }
        if(!this.form.value.component_parent){
            this.form.controls['component_parent'].setValue("-1");
        }
        this.httpClient.post( AppConstants.API_URL+"flujo_client_component", this.form.value)
            .subscribe(
            data => {
                this.parsePostResponse(data);
                this.spinnerService.hide();
            },
            error => {
                this.loading = false;
                this.spinnerService.hide();
            });
    }

    clearFile = () =>{
        this.form.get('avatar').setValue(null);
        this.fileInput.nativeElement.value = '';
    }
    onDelete = (body) => {
        // const formModel = this.form.value;
        this.spinnerService.show();
        let component_id = body.id;
        this.httpClient.delete(AppConstants.API_URL+"flujo_client_component/"+component_id)
            .subscribe(
            data => {
                this.getPageDetails();
                this.spinnerService.hide();
                this.pageDetails = null;
                console.log(data);
                this.loading = false;
            },
            error => {
                this.loading = false;
                this.spinnerService.hide();
            });
    }
    getPageDetails = () => {
        this.spinnerService.show();
        this.httpClient.get( AppConstants.API_URL+"flujo_client_getcomponent/"+AppConstants.CLIENT_ID)
        
            .subscribe(
            data => {
                this.pageDetails = data;
                console.log(this.pageDetails);
                this.parentPageDetails = _.filter(this.pageDetails, (parentData)=>{
                    return parentData.parent_id == -1; 
                });
                // this.setDefaultClientPageDetails(this.pageDetails);
                console.log(this.parentPageDetails);
                this.spinnerService.hide();
            },
            error => {
                console.log(error);
                this.loading = false;
                this.spinnerService.hide();
            }
            )
    }

    //this method is used to update page detals to the form, if detalis exist
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
            this.form.controls['component_parent'].setValue(pageData.parent_id);
            this.dummy = pageData.parent_id
            console.log(this.form.value);
        }

    }
    addPages = () => {
        this.form.reset();
        this.isEdit = true;
    }
    viewPages = () => {
        this.getPageDetails();
        this.isEdit = false;
    }
    editCompnent = (componentItem) => {
        this.alertService.success('page updated successfull.');
        this.isEdit = true;
        this.button_text = "Update";
        this.setDefaultClientPageDetails(componentItem);
    }
    parsePostResponse(response){
        
        if(response.result){
            this.loading = false;
          this.alertService.danger('Required parameters missing.');
        }else{
            this.alertService.success('page operation successfull.');
            this.loading = false;
            this.form.reset();
            this.getPageDetails();
            this.isEdit = false;
            this.button_text = "save";

        }
    }
    ngOnDestroy() {
        if(this.dialog) {
          this.dialog = null;
        }
      }
}