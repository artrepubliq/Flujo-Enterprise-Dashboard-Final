import {Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { HttpService } from '../service/httpClient.service';
import { IProfileData } from '../model/profile.model';
import {MatTableModule} from '@angular/material/table';
import {MatTableDataSource} from '@angular/material';
import { AlertModule, AlertService } from 'ngx-alerts';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AppComponent } from '../app.component';
import { AppConstants } from '../app.constants';
import { HttpClient } from '@angular/common/http';
import { IHttpResponse } from '../model/httpresponse.model';

@Component({
  selector: './app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileImage: any;
  profileItems: any;
  profileImageDetails: any;
  form: FormGroup;
  loading = false;
  button_text = 'save';
  decodedString: string;
  profileImag: string;
  isEdit: boolean;
  resultExist: boolean;
  isDataExist: boolean;
  isHideDeletebtn: boolean;
  profileData: IProfileData;
  ELEMENT_DATA: IProfileData;
  profileDetail: Array<object>;
  successMessage: string;
  // dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(private httpClient: HttpClient, private spinnerService: Ng4LoadingSpinnerService,
    private formBuilder: FormBuilder, private alertService: AlertService) {
    this.createForm();
    localStorage.setItem('client_id', '1232');
    this.getProfileDetails();
  }
  PHONE_REGEXP = /^([0]|\+91)?[789]\d{9}$/;
  EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
  createForm = () => {
    this.form = this.formBuilder.group({
      company_name: ['', Validators.required],
      website_url: ['', Validators.required],
      mobile_number: ['', Validators.compose([Validators.required, Validators.pattern(this.PHONE_REGEXP)])],
      client_id: localStorage.getItem('client_id'),
      email: ['', Validators.compose([Validators.required, Validators.pattern(this.EMAIL_REGEXP)])],
      // avatar: null
    });
  }
  ngOnInit() {
    setTimeout(function() {
        this.spinnerService.hide();
      }.bind(this), 3000);
}
  onFileChange = (event) => {
    this.profileDetail = [];
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.size <= 600000) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        // this.profileData.avatar = reader.result.split(',')[1];
        this.profileItems.avatar = reader.result.split(',')[1];
        this.profileDetail.push(reader.result.split(',')[1]);
        // this.form.get('avatar').setValue(reader.result.split(',')[1]);
        const uploadImage = {profile_id: this.profileImageDetails.id, client_id: this.profileImageDetails.client_id,
           avatar: reader.result.split(',')[1] };
        this.uploadProfileImage(uploadImage);
      };
    } else {
      this.alertService.danger('File is too large');
    }
    }
  }
  uploadProfileImage = (reqObject) => {
  this.spinnerService.show();
  this.form.controls['client_id'].setValue(AppConstants.CLIENT_ID);
  // const imageModel = this.form.value
  this.httpClient.post(AppConstants.API_URL + 'flujo_client_postprofileimageupload', reqObject)
.subscribe(
  data => {
    this.profileImageDetails = reqObject.avatar;
    this.alertService.success('Profile Image Uploaded successfully.');
     this.loading = false;
     this.spinnerService.hide();
  },
  error => {
    this.loading = false;
    this.spinnerService.hide();
    this.alertService.danger('Profile Image not uploaded');
  });
  }
  onSubmit = (body) => {
    this.spinnerService.show();
    const formModel = this.form.value;
    formModel.client_id = localStorage.getItem('client_id');
    this.httpClient.post<IHttpResponse>(AppConstants.API_URL + 'flujo_client_postprofile', formModel)
    .subscribe(
        data => {
          if (data.error) {
            this.alertService.warning(data.result);
            this.spinnerService.hide();
          } else {
            this.parsePostResponse(data);
            this.alertService.success('Profile details submitted successfully.');
            // this.getProfileDetails();
            // this.parsePostResponse(data);
            // this.alertService.success('request Successfully submitted.');
            this.getProfileDetails();
            //  this.loading = false;
            this.spinnerService.hide();
          }
        },
        error => {
          this.loading = false;
          this.spinnerService.hide();
          this.alertService.danger('Something went wrong.');
        });
  }

  clearFile = () => {
    this.form.get('avatar').setValue(null);
    this.fileInput.nativeElement.value = '';
  }

  onDelete = (body) => {
    this.spinnerService.show();
    const formModel = this.profileItems.avatar;
    this.spinnerService.show();
    this.loading = true;
    // console.log(formModel);
    this.httpClient.delete(AppConstants.API_URL + 'flujo_client_deleteprofile/' + AppConstants.CLIENT_ID)
    .subscribe(
        data => {
          this.alertService.success('profile image deleted Successfully.');
          this.form.reset();
          this.getProfileDetails();
          this.button_text = 'save';
          // this.isHideDeletebtn = false;
          this.spinnerService.hide();
           console.log(data);
           this.spinnerService.hide();
        },
        error => {
          this.loading = false;
          this.spinnerService.hide();
        });
  }

  getProfileDetails = () => {
    this.loading = true;
    this.spinnerService.show();
    this.httpClient.get(AppConstants.API_URL + 'flujo_client_getprofile/' + AppConstants.CLIENT_ID)
        .subscribe(
          data => {
            this.profileImageDetails = data;
            // this.BindProfileData(data);
            data ? this.isEdit = false : this.isEdit = true;
            if (data != null) {
            this.setDefaultClientProfileDetails(data);
             this.spinnerService.hide();
            } else {
              this.button_text = 'save';
              this.isHideDeletebtn = false;
              data ? this.isEdit = false : this.isEdit = true;
              this.alertService.success('No Data found');
              this.spinnerService.hide();
            }
             this.loading = false;
            // this.isEdit = false;
          },
          error => {
            console.log(error);
            this.loading = false;
            this.spinnerService.hide();
          }
        );
  }

  // BindProfileData = (profileData) => {
  //   this.profileData = profileData.result;
  //   console.log(profileData);
  // }
  // this method is used to update profile detals to the form, if detalis exist
  // EditProfileData(){
  //     this.isEdit = true;
  //     this.button_text = "Update";
  //     this.profileImag = this.profileData.avatar;
  //     this.form.controls['company_name'].setValue(this.profileData.company_name);
  //     this.form.controls['website_url'].setValue(this.profileData.website_url);
  //     this.form.controls['mobile_number'].setValue(this.profileData.mobile_number);
  // }
  EditInfo = () => {
    this.isEdit = true;
  }
  setDefaultClientProfileDetails = (profileData) => {

    this.resultExist = profileData;

    if (profileData) {
      this.isHideDeletebtn = true;
      this.button_text = 'Update';
      this.profileItems = profileData;
      this.profileImage = profileData.avatar;
      this.form.controls['company_name'].setValue(profileData.company_name);
      this.form.controls['website_url'].setValue(profileData.website_url);
      this.form.controls['email'].setValue(profileData.email);
      this.form.controls['mobile_number'].setValue(profileData.mobile_number);
      // this.form.controls['slogan_text'].setValue(profileData.slogan_text);
      // this.form.controls['avatar'].setValue(profileData);
    }

  }
  cancelFileEdit() {
    this.isEdit = false;
    this.setDefaultClientProfileDetails(this.profileImageDetails);
  }

  parsePostResponse(response) {
    if (!response) {
        this.loading = false;
        this.spinnerService.hide();
      this.alertService.danger('Required parameters missing.');
    } else {
        // this.alertService.success('page operation successfull.');
        this.loading = false;
        this.spinnerService.hide();
        this.form.reset();
        this.getProfileDetails();
        this.isEdit = false;
        this.button_text = 'save';

    }
}
}
