import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ILogo } from '../model/logo.model';
import { AlertModule, AlertService } from 'ngx-alerts';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Tree } from '@angular/router/src/utils/tree';
import { AppConstants } from '../app.constants';
import { HttpClient } from '@angular/common/http';
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
  isHideDeletebtn: boolean = false;
  resultExist: boolean;
<<<<<<< HEAD
  isHide: boolean;
  logoDetail: Array<object>;
=======
  isHide:boolean;
  logoDetail:Array<object>;
>>>>>>> origin/master
  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(private spinnerService: Ng4LoadingSpinnerService, private formBuilder: FormBuilder, private httpClient: HttpClient, private alertService: AlertService) {
    this.createForm();
    this.getLogoDetails();
  }
  ngOnInit() {
    setTimeout(function () {
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
      client_id: null,
      theme_id: "23",
      avatar: null
    });
  }

  onFileChange = (event) => {
    this.logoDetail = [];
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.logoItems.logo_url_path = reader.result.split(',')[1];
        this.logoDetail.push(reader.result.split(',')[1]);
        this.form.get('avatar').setValue(reader.result.split(',')[1]);
        this.uploadLogoimageHttpRequest(this.form);
      };
    }
  }

uploadLogoimageHttpRequest(reqObject){
  this.spinnerService.show();
  this.form.controls['client_id'].setValue(AppConstants.CLIENT_ID);
  const imageModel = this.form.value
  this.httpClient.post(AppConstants.API_URL+"flujo_client_logo",imageModel)
.subscribe(
  data => {
    this.alertService.success('Logo submitted successfully.');
     this.loadingSave = false;
     this.getLogoDetails();
     this.spinnerService.hide();
  },
  error => {
    this.loadingSave = false;
    this.spinnerService.hide();
  });
}
  onSubmit = (body) => {
    this.spinnerService.show();
    this.logoDetail[0];
    this.form.controls['client_id'].setValue(AppConstants.CLIENT_ID);

    this.form.controls['avatar'].setValue(this.logoDetail[0]);
        const formModel = this.form.value;
    this.loadingSave = true;

    this.httpClient.post(AppConstants.API_URL + "flujo_client_logo", formModel)
      .subscribe(
      data => {
        this.alertService.success('Logo details submitted successfully.');
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
    this.httpClient.delete(AppConstants.API_URL + "flujo_client_logo/" + AppConstants.CLIENT_ID)
      .subscribe(
      data => {
        this.alertService.success('logo items deleted Successfully');
        this.getLogoDetails();
        this.isEdit = true;
        this.loadingDelete = false;
        this.form.reset();
      },
      error => {
        this.loadingDelete = false;
      });
  }
  getLogoDetails = () => {
    this.loadingSave = true;
    this.spinnerService.show();
    this.httpClient.get(AppConstants.API_URL+"flujo_client_logo/"+AppConstants.CLIENT_ID)
        .subscribe(
          data =>{
            data? this.isEdit =false : this.isEdit = true;
            if(data != null){
            this.setDefaultClientLogoDetails(data);
             this.isHide=true;
             this.spinnerService.hide();
            } else{
              this.button_text = "save";
              this.isHideDeletebtn = false;
              data? this.isEdit =false : this.isEdit = true;
              this.alertService.success('No Data found');    
              this.isHide=false;
              this.spinnerService.hide();   
            }
            // this.loadingSave = false;
            // this.isEdit = false;
          },
          error =>{
            console.log(error);
            this.loadingSave = false;
          }
        )
  }
  EditInfo = () => {
    this.isEdit = true;
  }
  editLogo = () => {
    this.isEdit = true;
  }
  //this method is used to update logo detals to the form, if detalis exist
  setDefaultClientLogoDetails = (logoData) => {

    this.resultExist = logoData;

    if (logoData) {
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
  // Form Cancel
  cancelFileEdit() {
    this.isEdit = false;
  }

}