import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpService } from '../service/httpClient.service';
import { AlertModule, AlertService } from 'ngx-alerts';
import { ColorPickerModule,ColorPickerDirective } from 'ngx-color-picker';
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
    
    public pageDetails: object;
    public component_description: string = '';
    @ViewChild('fileInput') fileInput: ElementRef;
    
    constructor(private formBuilder: FormBuilder, private httpService: HttpService, private alertService: AlertService) {
        this.createForm();
        localStorage.setItem('client_id', "1232");
        this.getPageDetails();
    }
    
    createForm = () => {
        this.form = this.formBuilder.group({
            component_name: ['', Validators.required],
            component_menu_name: ['', Validators.required],
            component_parent: null,
            component_description: ['', Validators.required],
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
        const formModel = this.form.value;
        
        this.form.controls['client_id'].setValue(localStorage.getItem("client_id"));
        if(!body.component_id){
            this.form.controls['component_id'].setValue("null");
        }
        if(!this.form.value.component_parent){
            this.form.controls['component_parent'].setValue("-1");
        }
        this.loading = true;

        this.httpService.updatePost(this.form.value, "/flujo_client_component")
            .subscribe(
            data => {
                this.parsePostResponse(data);
            },
            error => {
                this.loading = false;
            });
    }

    clearFile = () =>{
        this.form.get('avatar').setValue(null);
        this.fileInput.nativeElement.value = '';
    }
    onDelete = (body) => {
        // const formModel = this.form.value;
        this.loading = true;
        let component_id = body.id;
        this.httpService.delete(component_id, "/flujo_client_component/")
            .subscribe(
            data => {
                this.getPageDetails();
                this.pageDetails = null;
                console.log(data);
                this.loading = false;
            },
            error => {
                this.loading = false;
            });
    }
    getPageDetails = () => {
        this.loading = true;
        this.httpService.getById(localStorage.getItem("client_id"), "/flujo_client_component/")
            .subscribe(
            data => {
                
                this.pageDetails = data;

                this.setDefaultClientPageDetails(this.pageDetails);
                console.log(data);
                this.loading = false;
            },
            error => {
                console.log(error);
                this.loading = false;
            }
            )
    }

    //this method is used to update page detals to the form, if detalis exist
    setDefaultClientPageDetails = (pageData) => {
        if (pageData) {
            // this.button_text = "Update";
            this.form.controls['component_id'].setValue(pageData.id);
            this.form.controls['component_name'].setValue(pageData.component_name);
            this.form.controls['component_description'].setValue(pageData.component_description);
            this.form.controls['component_image'].setValue(pageData.component_image);
            this.form.controls['component_background_image'].setValue(pageData.component_background_image);
            this.form.controls['component_order'].setValue(pageData.component_order);
            this.form.controls['component_parent'].setValue(pageData.component_parent);

            // this.form.controls['avatar'].setValue(logoData.result.);

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