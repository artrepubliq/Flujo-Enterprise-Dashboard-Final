import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { HttpService } from '../service/httpClient.service';
import { IProfileData } from '../model/profile.model';
import {MatTableModule} from '@angular/material/table';
import {MatTableDataSource} from '@angular/material';
import { AlertModule, AlertService } from 'ngx-alerts';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AppComponent } from '../app.component';
import { AppConstants } from '../app.constants';
import { HttpClient } from '@angular/common/http';

@Component({
  selector:'./app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent { 
  form: FormGroup;
  loading: boolean = false;
  button_text: string = "save";
  decodedString: string;
  profileImag: string;
  isEdit: boolean;
  isDataExist: boolean;
  profileData: IProfileData;
  ELEMENT_DATA: IProfileData;  
  // dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  
  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(private httpClient: HttpClient, private spinnerService: Ng4LoadingSpinnerService,private formBuilder: FormBuilder, private alertService: AlertService) {
    this.createForm();
    localStorage.setItem('client_id',"1232");
    this.getProfileDetails();
    
  }
  ngOnInit() {
        setTimeout(function() {
            this.spinnerService.hide();
          }.bind(this), 3000);
  }
  PHONE_REGEXP = /^([0]|\+91)?[789]\d{9}$/;
  createForm = ()=> {
    this.form = this.formBuilder.group({
      company_name: ['', Validators.required],
      website_url: ['', Validators.required],
      mobile_number: ['', Validators.compose([Validators.required, Validators.pattern(this.PHONE_REGEXP)])],
      client_id: localStorage.getItem("client_id"),
      avatar: null
    });
  }

  onFileChange = (event)=> {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.form.get('avatar').setValue(reader.result.split(',')[1]
        )
      };
    }
  }

  onSubmit = (body)=> {
    const formModel = this.form.value;
    
    // if(!this.form.value.avatar){
    //   formModel.avatar = "null"
    // }
    formModel.client_id = localStorage.getItem("client_id");
    this.spinnerService.show();
    this.httpClient.post(AppConstants.API_URL+"flujo_client_profile", formModel)
    .subscribe(
        data => {
          // this.parsePostResponse(data);
          // this.alertService.success('request Successfully submitted.');
          this.getProfileDetails();
          //  this.loading = false;
          this.spinnerService.hide();
        },
        error => {
          this.loading = false;
          this.spinnerService.hide();
        });
  }

  clearFile = ()=> {
    this.form.get('avatar').setValue(null);
    this.fileInput.nativeElement.value = '';
  }

  onDelete = (body)=>{
    const formModel = this.form.value;
    this.spinnerService.show();
    this.loading = true;
    console.log(formModel);
    this.httpClient.delete(AppConstants.API_URL+"flujo_client_profile/"+AppConstants.CLIENT_ID)
    .subscribe(
        data => {
          this.alertService.success('profile deleted Successfully.');
          this.form.reset();
          this.getProfileDetails();
           console.log(data);
           this.spinnerService.hide();
           
        },
        error => {
          this.loading = false;
          this.spinnerService.hide();
        });
  }

  getProfileDetails = ()=>{
    this.loading = true;
    this.spinnerService.show();
    this.httpClient.get(AppConstants.API_URL+"flujo_client_profile/"+AppConstants.CLIENT_ID)
        .subscribe(
          data =>{
            console.log(data);
            this.BindProfileData(data);
             // this.setDefaultClientProfileDetails(data);
            this.isEdit = false;
            this.loading = false;
            this.spinnerService.hide();
          },
          error =>{
            console.log(error);
            this.loading = false;
            this.spinnerService.hide();
          }
        )
  }

  BindProfileData = (profileData)=>{
    this.profileData = profileData.result;
  }
  //this method is used to update profile detals to the form, if detalis exist
  EditProfileData(){
      this.isEdit = true;
      this.button_text = "Update";
      this.profileImag = this.profileData.avatar;
      this.form.controls['company_name'].setValue(this.profileData.company_name);
      this.form.controls['website_url'].setValue(this.profileData.website_url);
      this.form.controls['mobile_number'].setValue(this.profileData.mobile_number);    
  }
  cancelFileEdit(){
    this.isEdit = false;
  }

  parsePostResponse(response){
    
    if(!response){
        this.loading = false;
        this.spinnerService.hide();
      this.alertService.danger('Required parameters missing.');
    }else{
        this.alertService.success('page operation successfull.');
        this.loading = false;
        this.spinnerService.hide();
        this.form.reset();
        this.getProfileDetails();
        this.isEdit = false;
        this.button_text = "save";

    }
}
}