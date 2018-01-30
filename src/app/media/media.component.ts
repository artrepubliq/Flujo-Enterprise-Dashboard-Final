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
import { HttpService } from '../service/httpClient.service';
import { IGalleryObject } from '../model/gallery.model';
import { IGalleryImages } from '../model/gallery.model';

import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

import * as _ from 'underscore';



@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})


export class MediaComponent implements OnInit {
  hightlightStatus: Array<boolean> = [];
  public successMessage;
  public loading = false;
  public successMessagebool;
  public deleteMessage;
  public deleteMessagebool;
  public mediaData:mediaDetail;
  mediaManagementForm:any;
  showHide: boolean;
  submitAlbumData:FormGroup;
  albumObject: IGalleryObject;
  albumImages: Array<IGalleryImages>;
  albumImage:IGalleryImages;
  
  isImageExist:boolean;
  // public albumData: {id: any, name: string,desc: string}
  // template: string =`<img src="http://pa1.narvii.com/5722/2c617cd9674417d272084884b61e4bb7dd5f0b15_hq.gif" />`
  constructor(private spinnerService: Ng4LoadingSpinnerService, private http: HttpClient,private httpService: HttpService, private formBuilder: FormBuilder, private alertService: AlertService) {
    
    this.mediaManagementForm = this.formBuilder.group({
        image: [null],
        client_id:[null]
      });
      this.submitAlbumData = this.formBuilder.group({
        title : ['',],
        image_ids:[null],
        client_id:[null]
      });
    this.getMediaGaleeryData();
    this.showHide = false;
    this.isImageExist= false;
   }
   

  ngOnInit() {  
    setTimeout(function() {
      this.spinnerService.hide();
    }.bind(this), 3000); 

  ngOnInit() {   
    

    this.albumObject  = <IGalleryObject>{}
    this.albumObject.images = [];
  }
  selectMedia(event) {
    let imageDetail = [];
    if (event.target.files && event.target.files.length > 0) {
      for(var i=0; i < event.target.files.length; i++){
      let reader = new FileReader();
      let file = event.target.files[i];
      reader.readAsDataURL(file);
      reader.onload = () => {
      console.log(reader.result.split(',')[1]);
      imageDetail.push(reader.result.split(',')[1]);
      console.log(imageDetail);
      };
    }this.mediaManagementForm.get('image').setValue(imageDetail);
    console.log(imageDetail);
  }
  }
  
  mediaManagementFormSubmit(body:any){
    // this.loading = true;
    this.spinnerService.show();
    this.mediaManagementForm.controls['client_id'].setValue(localStorage.getItem("client_id"));
    const formModel = this.mediaManagementForm.value;
    this.http.post("http://flujo.in/dashboard/flujo.in_api_client/flujo_client_mediamanagement", formModel).subscribe(
      res => {
        console.log(res);
        this.getMediaGaleeryData();

        this.successMessage = "Images uploaded successfully";
        this.successMessagebool = true;
        this.alertService.success('Images uploaded successfully');
        // this.loading = false;
        this.spinnerService.hide();
        this.mediaManagementForm=null;
        

        this.mediaManagementForm=null;
        this.successMessagebool = true;
        this.alertService.success('Images uploaded successfully');

      },
      (err: HttpErrorResponse) => {
        // this.loading = false;
        this.spinnerService.hide();
        // this.errMsg = err.message;
        console.log(err.error);
        console.log(err.name);
        console.log(err.message);
        console.log(err.status);
      }
    );
  }
  //
  getMediaGaleeryData(){
    // this.loading = true;
    this.spinnerService.show();
    this.http
      .get<mediaDetail>('http://flujo.in/dashboard/flujo.in_api_client/flujo_client_mediagallery')
      .subscribe(
        
      // Successful responses call the first callback.
      data => {
        this.mediaData=data;
        // this.loading = false;
        this.spinnerService.hide();
        console.log(this.mediaData);
      },
      
      err => {
        this.spinnerService.hide();
      }
      );
  }
  deleteMediaImage(image_id){
    // console.log(kn);
    if (localStorage.getItem("client_id")) {
      this.mediaManagementForm.controls['client_id'].setValue(localStorage.getItem("client_id"));
      this.httpService.delete(localStorage.getItem("client_id"), "/flujo_client_deletemedia/")
        .subscribe(
        data => {
          if (data) {
            this.alertService.success('Social Links deleted Successfully');
            this.getMediaGaleeryData();
          }
        },
        error => {
          console.log(error);
        })
    }
  }
  getImageId(item_id){
    var item_index =_.indexOf(this.albumObject.images, item_id.id);
    console.log(item_index);
    if(item_index != -1){
      this.albumObject.images.splice(item_index, 1);
      console.log(this.albumObject);
    }else{
      this.albumObject.images.push(item_id.id);
      console.log(this.albumObject);
    }
  }
// 
  submitAlbumDataPost(body:any){
    this.submitAlbumData.controls['image_ids'].setValue(this.albumObject);
    this.submitAlbumData.controls['client_id'].setValue(localStorage.getItem("client_id"));
    const formModel = this.submitAlbumData.value;
    console.log(formModel);
    
    this.httpService.create(formModel, "/flujo_client_postgalleryimages")
    .subscribe(
        data => {
          console.log(this.submitAlbumData.value);
          if (data) {

            this.alertService.success('Social Links uploaded Successfully');

            this.alertService.success('Album created successfully.');

          }
        },
        error => {
          this.alertService.danger("Something went wrong.please try again.");
          console.log(error);
        })
  }
  changeShowStatus(){
    this.showHide = !this.showHide;
  }
  showImageId(){
    this.isImageExist = !this.isImageExist;
  }
}
