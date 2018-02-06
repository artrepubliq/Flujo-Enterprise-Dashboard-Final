import { Component, OnInit, ElementRef, ViewChild, SimpleChanges } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Http, Headers, RequestOptions } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { mediaDetail } from '../model/feedback.model';
import { AlertModule, AlertService } from 'ngx-alerts';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { FileUploadModule } from "ng2-file-upload";
import { MatButtonModule } from '@angular/material';
import { IGalleryObject, IGalleryImageItem } from '../model/gallery.model';
import { AppConstants } from '../app.constants';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import * as _ from 'underscore';
import { Router } from '@angular/router'; 
import { AppRoutingModule } from '../app-routing.module';
@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})

export class MediaComponent implements OnInit {
  hightlightStatus: Array<boolean> = [];
  public successMessage;
  public loading = false;
  public ishide: boolean;
  public successMessagebool;
  public deleteMessage;
  public deleteMessagebool;
  public mediaData: mediaDetail;
  mediaManagementForm: any;
  showHide: boolean;
  submitAlbumData: FormGroup;
  albumObject: IGalleryObject;
  albumImages: Array<IGalleryImageItem>;
  albumImage: IGalleryImageItem;
  showCreateGallery: boolean = true;
  isshowAlbumGallery: boolean = false;

  isImageExist: boolean;
  // File uploader Styles====
  customStyle = {
    selectButton: {
      "border-radius": "20px",
      "background-color": "#ee286b",
      "box-shadow": "0 1.5px 18px 0 rgba(0, 0, 0, 0.15)",
      "font-size": "14px",
      "font-weight": "500",
      "text-align": "center",
      "color": "#ffffff",
      "text-transform": "initial",
      "font-family": "Roboto",
      "width": "130px",
      "height": "40px",
      "float": "right"
    },
    clearButton: {
      "border-radius": "20px",
      "background-color": "#ee286b",
      "box-shadow": "0 1.5px 18px 0 rgba(0, 0, 0, 0.15)",
      "font-size": "14px",
      "font-weight": "500",
      "text-align": "center",
      "color": "#ffffff",
      "text-transform": "initial",
      "font-family": "Roboto",
      "width": "130px",
      "height": "40px",
      "float": "right"
    },
    layout: {
      "border-radius": "5px",
      "background-color": "transparent",
      "border": "dashed 1.5px #91d7ea"
    },
    previewPanel: {
      "background-color": "transparent",
      "border-radius": "0 0 25px 25px",
    },
    dropBoxMessage: {
      "font-family": "Roboto",
      "font-size": "15px",
      "font-weight": "500",
      "text-align": "center",
      "color": "red",
      "display":"none"
    },
    
  }
  // template: string =`<img src="http://pa1.narvii.com/5722/2c617cd9674417d272084884b61e4bb7dd5f0b15_hq.gif" />`
  constructor(private spinnerService: Ng4LoadingSpinnerService, private httpClient: HttpClient, private formBuilder: FormBuilder, private alertService: AlertService) {
    this.mediaManagementForm = this.formBuilder.group({
      image: [null],
      client_id: [null]
    });
    this.submitAlbumData = this.formBuilder.group({
      title: ['', Validators.required],
      image_ids: [null],
      client_id: [null]
    });
    this.getMediaGalleryData();
    this.showHide = false;
    this.isImageExist = false;
    this.ishide = true;
  }


  ngOnInit() {
    setTimeout(function () {
      this.spinnerService.hide();
    }.bind(this), 3000);

    this.albumObject = <IGalleryObject>{}
    this.albumObject.images = [];

  }
  selectMedia(event) {
    let imageDetail = [];
    if (event.target.files && event.target.files.length > 0) {
      this.ishide = false;
      for (var i = 0; i < event.target.files.length; i++) {
        let reader = new FileReader();
        let file = event.target.files[i];
        reader.readAsDataURL(file);
        reader.onload = () => {
          imageDetail.push(reader.result.split(',')[1]);
        };
      } this.mediaManagementForm.get('image').setValue(imageDetail);
    }

  }

  mediaManagementFormSubmit(body: any) {
    this.spinnerService.show();
    this.mediaManagementForm.controls['client_id'].setValue(AppConstants.CLIENT_ID);
    const formModel = this.mediaManagementForm.value;
    this.httpClient.post(AppConstants.API_URL + "flujo_client_mediamanagement", formModel).subscribe(
      res => {
        this.getMediaGalleryData();
        this.spinnerService.hide();
        this.mediaManagementForm.reset();
        this.alertService.success('Images uploaded successfully');
      },
      (err: HttpErrorResponse) => {
        this.spinnerService.hide();
        console.log(err.error);
        console.log(err.name);
        console.log(err.message);
        console.log(err.status);
      }
    );
  }
  getMediaGalleryData(){
    this.spinnerService.show();
    this.httpClient
      .get<mediaDetail>(AppConstants.API_URL + 'flujo_client_mediagallery')
      .subscribe(
      data => {
        this.mediaData = data;
        this.spinnerService.hide();
        console.log(this.mediaData);
      },

      err => {
        this.spinnerService.hide();
      }
      );
  }
  deleteMediaImage(image_id) {
    this.spinnerService.show();
    this.httpClient.delete(AppConstants.API_URL + "flujo_client_deletemedia/" + image_id)
      .subscribe(
      data => {
        if (data) {
          this.hightlightStatus = [false];
          this.spinnerService.hide();
          this.alertService.success('Image deleted Successfully');
          this.getMediaGalleryData();
        }
      },
      error => {
        this.spinnerService.hide();
        console.log(error);
      });

  }
  getImageId(item_id) {
    var item_index = _.indexOf(this.albumObject.images, item_id.id);
    var t = _.size(this.albumObject.images);
    this.albumImage = <IGalleryImageItem>{};
    this.albumImage.id = item_id.id;
    this.albumImage.title = null;
    this.albumImage.description = null;
    if (item_index != -1) {
      this.albumObject.images.splice(item_index, 1);

    } else {
      this.albumObject.images.push(this.albumImage);
      console.log(this.albumObject);
    }
  }

  submitAlbumDataPost(body: any) {
    this.spinnerService.show();
    this.submitAlbumData.controls['image_ids'].setValue(this.albumObject);
    this.submitAlbumData.controls['client_id'].setValue(localStorage.getItem("client_id"));
    const formModel = this.submitAlbumData.value;
    this.httpClient.post(AppConstants.API_URL + "flujo_client_postgalleryimages", formModel)
      .subscribe(
      data => {
        this.spinnerService.hide();
        if (data) {
          this.submitAlbumData.reset();
          this.hightlightStatus = [false];
          this.alertService.success('Album created successfully.');
        } else {

          this.alertService.danger("Something went wrong.please try again.");
        }
      },
      error => {
        this.spinnerService.hide();
        this.alertService.danger("Something went wrong.please try again.");
        console.log(error);
      });


  }
  changeShowStatus() {
    this.showHide = !this.showHide;
    this.showCreateGallery = true;
    this.isshowAlbumGallery = false;
  }
  showImageId() {
    this.isImageExist = !this.isImageExist;
  }
  showAlbumGallery() {
    this.showCreateGallery = false;
    this.isshowAlbumGallery = true;
  }

  images = [
    { name: 'Title', imagesUer: 'profile_user.jpg' },
    { name: 'Title', imagesUer: 'profile_user.jpg' },
    { name: 'Title', imagesUer: 'profile_user.jpg' },
    { name: 'Title', imagesUer: 'profile_user.jpg' },
    { name: 'Title', imagesUer: 'profile_user.jpg' },
    { name: 'Title', imagesUer: 'profile_user.jpg' },
    { name: 'Title', imagesUer: 'profile_user.jpg' },
    { name: 'Title', imagesUer: 'profile_user.jpg' },
    { name: 'Title', imagesUer: 'profile_user.jpg' },
    { name: 'Title', imagesUer: 'profile_user.jpg' },
    { name: 'Title', imagesUer: 'profile_user.jpg' },
    { name: 'Title', imagesUer: 'profile_user.jpg' },
    { name: 'Title', imagesUer: 'profile_user.jpg' },
    { name: 'Title', imagesUer: 'profile_user.jpg' },
    { name: 'Title', imagesUer: 'profile_user.jpg' },
    { name: 'Title', imagesUer: 'profile_user.jpg' }
  ]

}
