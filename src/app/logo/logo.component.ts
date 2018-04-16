import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ILogo } from '../model/logo.model';
import { AlertModule, AlertService } from 'ngx-alerts';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Tree } from '@angular/router/src/utils/tree';
import { AppConstants } from '../app.constants';
import { HttpClient } from '@angular/common/http';
import { IHttpResponse } from '../model/httpresponse.model';
import * as _ from 'underscore';
import { AdminComponent } from '../admin/admin.component';
import { Router } from '@angular/router';
import { ICommonInterface } from '../model/commonInterface.model';
import { AccessDataModelComponent } from '../model/useraccess.data.model';
@Component({
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent implements OnInit {
  filteredUserAccessData: any;
  userAccessLevelObject: any;
  logoImage: any;
  form: FormGroup;
  loadingSave = false;
  loadingDelete: boolean;
  button_text = 'save';
  decodedString: string;
  logoItems: ILogo;
  isEdit = true;
  isHideDeletebtn = false;
  resultExist: boolean;
  isHide: boolean;
  logoImageDetails?: any;
  logoDetail: Array<object>;
  userAccessDataModel: AccessDataModelComponent;
  @ViewChild('fileInput') fileInput: ElementRef;
  feature_id = 13;
  constructor(private spinnerService: Ng4LoadingSpinnerService, private formBuilder: FormBuilder,
    private httpClient: HttpClient, private alertService: AlertService, public adminComponent: AdminComponent, private router: Router) {
    this.createForm();
    this.getLogoDetails();
    if (Number(localStorage.getItem('feature_id')) !== this.feature_id) {
      this.userAccessDataModel = new AccessDataModelComponent(httpClient, router);
      this.userAccessDataModel.setUserAccessLevels(null, this.feature_id, 'admin/logo');
    }
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
      theme_id: '23'
    });
  }

  onFileChange = (event) => {
    this.logoItems = <ILogo>{};
    this.logoDetail = [];
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.size <= 600000) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.logoItems.logo_image = reader.result.split(',')[1];
        this.logoDetail.push(reader.result.split(',')[1]);
        // this.form.get('avatar').setValue(reader.result.split(',')[1]);
        // console.log(reader.result.split(',')[1]);
        let uploadImage;
        if (this.logoImageDetails) {
          uploadImage = { logo_id: this.logoImageDetails.id, client_id: this.logoImageDetails.client_id,
            logo_image: reader.result.split(',')[1] };
        } else {
           uploadImage = { logo_id: null, client_id: AppConstants.CLIENT_ID, logo_image: reader.result.split(',')[1] };
        }
        this.uploadLogoimageHttpRequest(uploadImage);

      };
    } else {
      this.alertService.danger('File is too large');
      this.getLogoDetails();
    }
    }
  }


  uploadLogoimageHttpRequest(reqObject) {

    this.spinnerService.show();
    // const imageModel = this.form.value
    this.httpClient.post<ICommonInterface>(AppConstants.API_URL + 'flujo_client_postlogoupload', reqObject)
      .subscribe(
      data => {
        if (data.http_status_code = 200) {
        // this.logoImage = reqObject.logo_image;
        this.alertService.success('Logo submitted successfully.');
        this.loadingSave = false;
        this.getLogoDetails();
        this.spinnerService.hide();
      } else {
        this.alertService.success('Logo not submitted successfully.');
        this.spinnerService.hide();
        this.getLogoDetails();
      }
      },
      error => {
        this.loadingSave = false;
        this.spinnerService.hide();
      });
  }

  onSubmit = (body) => {
    this.spinnerService.show();
    this.form.controls['client_id'].setValue(AppConstants.CLIENT_ID);
    const formModel = this.form.value;
    this.loadingSave = true;

    this.httpClient.post<ICommonInterface>(AppConstants.API_URL + 'flujo_client_postlogo', formModel)
      .subscribe(
      data => {
        if (data.error) {
          this.alertService.warning('Logo image not uploaded');
          this.loadingSave = false;
          this.getLogoDetails();
          this.spinnerService.hide();
        } else {
          this.alertService.success('Logo details submitted successfully.');
          this.loadingSave = false;
          this.getLogoDetails();
          this.spinnerService.hide();
        }
      },
      error => {
        this.loadingSave = false;
        this.spinnerService.hide();
      });
  }

  clearFile = () => {

    this.fileInput.nativeElement.value = '';
  }
  onDelete = (body) => {
    this.spinnerService.show();
    const formModel = this.logoImage;
    this.loadingDelete = true;
    this.httpClient.delete(AppConstants.API_URL + 'flujo_client_deletelogo/' + AppConstants.CLIENT_ID)
      .subscribe(
      data => {
        this.alertService.success('Logo deleted Successfully');
        this.getLogoDetails();
        this.isEdit = true;
        this.loadingDelete = false;
        this.form.reset();
        this.spinnerService.hide();
      },
      error => {
        this.loadingDelete = false;
        this.spinnerService.hide();
      });
  }
  getLogoDetails = () => {
    this.loadingSave = true;
    this.spinnerService.show();
    this.httpClient.get<ICommonInterface>(AppConstants.API_URL + 'flujo_client_getlogo/' + AppConstants.CLIENT_ID)
        .subscribe(
          data => {
            this.logoImageDetails = data.result;
            data ? this.isEdit = false : this.isEdit = true;
            console.log(data);
            if (data != null) {
            this.setDefaultClientLogoDetails(this.logoImageDetails);
             this.isHide = true;
             this.spinnerService.hide();
            } else {
              this.button_text = 'save';
              this.isHideDeletebtn = false;
              data ? this.isEdit = false : this.isEdit = true;
              this.alertService.success('No Data found');
              this.isHide = false;
              this.spinnerService.hide();
            }
             this.loadingSave = false;
            // this.isEdit = false;
          },
          error => {
            console.log(error);
            this.loadingSave = false;
          }
        );
  }
  EditInfo = () => {
    this.isEdit = true;
  }
  editLogo = () => {
    this.isEdit = true;
  }
  setDefaultClientLogoDetails = (logoData) => {

    this.resultExist = logoData;

    if (logoData) {
      this.isHideDeletebtn = true;
      this.button_text = 'Update';
      this.decodedString = logoData.logo_image;
      this.logoItems = logoData;
      this.logoImage = logoData.logo_image;
      this.form.controls['logo_text'].setValue(logoData.logo_text);
      this.form.controls['logo_caption'].setValue(logoData.logo_caption);
      this.form.controls['logo_height'].setValue(logoData.logo_height);
      this.form.controls['logo_width'].setValue(logoData.logo_width);
    }

  }
  // Form Cancel
  cancelFileEdit() {
    this.setDefaultClientLogoDetails(this.logoImageDetails);
    this.isEdit = false;
    }
  }
