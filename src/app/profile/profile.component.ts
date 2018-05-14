import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../service/httpClient.service';
import { IProfileData } from '../model/profile.model';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material';
import { AlertModule, AlertService } from 'ngx-alerts';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AppComponent } from '../app.component';
import { AppConstants } from '../app.constants';
import { HttpClient } from '@angular/common/http';
import { IHttpResponse } from '../model/httpresponse.model';
import { AccessDataModelComponent } from '../model/useraccess.data.model';
import { Router } from '@angular/router';
import { ICommonInterface } from '../model/commonInterface.model';

@Component({
  selector: './app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileImage: any;
  profileItems: any;
  profileImageDetails?: any;
  form: FormGroup;
  loading = false;
  button_text = 'save';
  decodedString: string;
  profileImag: string;
  isEdit = true;
  resultExist: boolean;
  isDataExist: boolean;
  isHideDeletebtn: boolean;
  profileData: IProfileData;
  ELEMENT_DATA: IProfileData;
  profileDetail: Array<object>;
  successMessage: string;
  feature_id = 31;
  @ViewChild('fileInput') fileInput: ElementRef;
  userAccessDataModel: AccessDataModelComponent;
  constructor(private httpClient: HttpClient, private spinnerService: Ng4LoadingSpinnerService,
    private formBuilder: FormBuilder, private alertService: AlertService,
    private router: Router) {
    this.createForm();
    localStorage.setItem('client_id', '1232');
    this.getProfileDetails();
    // if (Number(localStorage.getItem('feature_id')) !== this.feature_id) {
    //   this.userAccessDataModel = new AccessDataModelComponent(httpClient, router);
    //   this.userAccessDataModel.setUserAccessLevels(null, this.feature_id, 'admin/profile');
    // }
  }
  PHONE_REGEXP = /^([0]|\+91)?[6789]\d{9}$/;
  EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
  createForm = () => {
    this.form = this.formBuilder.group({
      company_name: ['', Validators.required],
      website_url: ['', Validators.required],
      mobile_number: ['', Validators.compose([Validators.required, Validators.pattern(this.PHONE_REGEXP)])],
      client_id: localStorage.getItem('client_id'),
      email: ['', Validators.compose([Validators.required, Validators.pattern(this.EMAIL_REGEXP)])],
    });
  }
  ngOnInit() {
    setTimeout(function () {
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
          this.profileItems.avatar = reader.result.split(',')[1];
          let uploadImage;
          if (this.profileImageDetails) {
            uploadImage = {
              profile_id: this.profileImageDetails[0].id, client_id: this.profileImageDetails[0].client_id,
              avatar: reader.result.split(',')[1]
            };
          } else {
            uploadImage = { profile_id: null, client_id: AppConstants.CLIENT_ID, avatar: reader.result.split(',')[1] };
          }
          this.uploadProfileImage(uploadImage);
        };
      } else {
        this.alertService.danger('File is too large');
      }
    }
  }
  uploadProfileImage = (reqObject) => {
    this.spinnerService.show();
    this.httpClient.post<ICommonInterface>(AppConstants.API_URL + 'flujo_client_postprofileimageupload', reqObject)
      .subscribe(
        data => {
          if ((data.http_status_code = 200) && (!data.error)) {
            // this.profileImageDetails = reqObject.avatar;
            this.alertService.success('Profile Image Uploaded successfully.');
            this.loading = false;
            this.spinnerService.hide();
          } else {
            this.loading = false;
            this.spinnerService.hide();
            this.alertService.danger('Profile Image not uploaded');
          }
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
    this.httpClient.post<ICommonInterface>(AppConstants.API_URL + 'flujo_client_postprofile', formModel)
      .subscribe(
        data => {
          if (data.access_token === AppConstants.ACCESS_TOKEN) {
            if ((data.error) && (data.custom_status_code = 101)) {
              this.alertService.warning('Required parameters are missing');
              this.spinnerService.hide();
            } else if ((!data.error) && (data.custom_status_code = 100)) {
              this.parsePostResponse(data);
              this.alertService.success('Profile details submitted successfully.');
              this.getProfileDetails();
              this.spinnerService.hide();
            } else if ((data.error) && (data.custom_status_code = 102)) {
              this.alertService.info('Everything is upto date');
            }
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
    this.httpClient.delete<ICommonInterface>(AppConstants.API_URL + 'flujo_client_deleteprofile/' + AppConstants.CLIENT_ID)
      .subscribe(
        data => {
            if ((!data.error) && (data.custom_status_code = 100)) {
              this.alertService.success('profile image deleted Successfully.');
              this.form.reset();
              this.getProfileDetails();
              this.button_text = 'save';
              // this.isHideDeletebtn = false;
              this.spinnerService.hide();
              console.log(data);
              this.spinnerService.hide();
            } else if ((data.error) && (data.custom_status_code = 102)) {
              this.alertService.info('Everything is upto date');
            } else if ((data.error) && (data.custom_status_code = 101)) {
              this.alertService.info('Required parameters are missing');
            }
        },
        error => {
          this.loading = false;
          this.spinnerService.hide();
        });
  }

  getProfileDetails = () => {
    this.loading = true;
    this.spinnerService.show();
    this.httpClient.get<ICommonInterface>(AppConstants.API_URL + 'flujo_client_getprofile/' + AppConstants.CLIENT_ID)
      .subscribe(
        data => {
            if ((!data.error) && (data.custom_status_code = 100)) {
              this.profileImageDetails = data.result;
              data.result ? this.isEdit = false : this.isEdit = true;
              if (data.result != null) {
                this.setDefaultClientProfileDetails(this.profileImageDetails);
                this.spinnerService.hide();
              } else {
                this.button_text = 'save';
                this.isHideDeletebtn = false;
                data.result ? this.isEdit = false : this.isEdit = true;
                this.alertService.success('No Data found');
                this.spinnerService.hide();
              }
              this.loading = false;
            }
        },
        error => {
          console.log(error);
          this.loading = false;
          this.spinnerService.hide();
        }
      );
  }
  EditInfo = () => {
    this.isEdit = true;
  }
  setDefaultClientProfileDetails = (profileData) => {
    console.log(profileData);
    this.resultExist = profileData;

    if (profileData) {
      this.isHideDeletebtn = true;
      this.button_text = 'Update';
      this.profileItems = profileData[0];
      this.profileImage = profileData[0].avatar;
      this.form.controls['company_name'].setValue(profileData[0].company_name);
      this.form.controls['website_url'].setValue(profileData[0].website_url);
      this.form.controls['email'].setValue(profileData[0].email);
      this.form.controls['mobile_number'].setValue(profileData[0].mobile_number);
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
      this.loading = false;
      this.spinnerService.hide();
      this.form.reset();
      this.getProfileDetails();
      this.isEdit = false;
      this.button_text = 'save';

    }
  }
}
