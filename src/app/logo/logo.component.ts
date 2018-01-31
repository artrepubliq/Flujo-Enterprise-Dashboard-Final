import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { HttpService } from '../service/httpClient.service';
import { ILogo } from '../model/logo.model';
import { AlertModule, AlertService } from 'ngx-alerts';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Tree } from '@angular/router/src/utils/tree';
@Component({
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent {
  form: FormGroup;
  loadingSave: boolean = false;
  loadingDelete: boolean;
  button_text: string = "save";
  decodedString: string;
  logoItems: ILogo;
  isEdit: boolean = true;
  isHideDeletebtn:boolean=false;
  resultExist: boolean;

  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(private spinnerService: Ng4LoadingSpinnerService,private formBuilder: FormBuilder, private httpService: HttpService, private alertService: AlertService) {
    this.createForm();
    localStorage.setItem('client_id',"1232");
    this.getLogoDetails();
  }
  ngOnInit() {   
        setTimeout(function() {
            this.spinnerService.hide();
          }.bind(this), 3000);
    
  }
  createForm = () => {
    this.form = this.formBuilder.group({
      logo_text: ['', Validators.required],
      logo_caption: ['', Validators.required],
      logo_height: ['', Validators.required],
      logo_width: ['', Validators.required],
      // slogan_text: ['', Validators.required],
      client_id: localStorage.getItem("client_id"),
      theme_id: "23",
      avatar: null
    });
  }

  onFileChange = (event) => {
    
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.logoItems.logo_url_path = reader.result.split(',')[1];
        this.form.get('avatar').setValue(reader.result.split(',')[1])
      };
    }
  }

  onSubmit = (body) => {
    this.spinnerService.show();
    const formModel = this.form.value;
    this.loadingSave = true;
    this.httpService.updatePost(formModel,"/flujo_client_logo")
    .subscribe(
        data => {
          this.alertService.success('Logo details submotted successfully.');
           this.loadingSave = false;
           this.getLogoDetails();
           this.spinnerService.hide();
        },
        error => {
          this.loadingSave = false;
          this.spinnerService.hide();
        });
  }

  clearFile = () => {
    this.form.get('avatar').setValue(null);
    this.fileInput.nativeElement.value = '';
  }
  onDelete = (body) => {
    const formModel = this.form.value;
    this.loadingDelete = true;
    this.httpService.delete(localStorage.getItem("client_id"),"/flujo_client_logo/")
    .subscribe(
        data => {
          this.alertService.success('logo items deleted Successfully');        
          this.getLogoDetails();
          this.loadingDelete = false;
          this.form.reset();
        },
        error => {
          this.loadingDelete = false;
        });
  }
  getLogoDetails = () => {
    this.loadingSave = true;
    this.httpService.getById(localStorage.getItem("client_id"),"/flujo_client_logo/")
        .subscribe(
          data =>{
            console.log(data);
            data? this.isEdit =false : this.isEdit = true;
            if(data != null){
            this.setDefaultClientLogoDetails(data);
            // this.isHide=true;
            } else{
              // this.alertService.success('No Data found');        
            }
            this.loadingSave = false;
            // this.isEdit = false;
          },
          error =>{
            console.log(error);
            this.loadingSave = false;
          }
        )
  }
  EditInfo = () =>{
    this.isEdit = true;
  }
  editLogo = () =>{
    this.isEdit = true;
  }
  //this method is used to update logo detals to the form, if detalis exist
  setDefaultClientLogoDetails = (logoData) => {
  
    this.resultExist = logoData;

    if(logoData){
      this.isHideDeletebtn = true;
      this.button_text = "Update";
      this.decodedString = logoData.logo_url_path;
      this.logoItems = logoData;
      this.form.controls['logo_text'].setValue(logoData.logo_text);
      this.form.controls['logo_caption'].setValue(logoData.logo_caption);
      this.form.controls['logo_height'].setValue(logoData.logo_height);
      this.form.controls['logo_width'].setValue(logoData.logo_width);
      // this.form.controls['slogan_text'].setValue(logoData.slogan_text);
      this.form.controls['avatar'].setValue(logoData);      
    }
    
  }
  
}