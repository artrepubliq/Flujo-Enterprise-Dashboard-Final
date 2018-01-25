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


@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})


export class MediaComponent implements OnInit {
  hightlightStatus: Array<boolean> = [];
  public successMessage;
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
  
  constructor(private http: HttpClient,private httpService: HttpService, private formBuilder: FormBuilder, private alertService: AlertService) {
    
    this.mediaManagementForm = this.formBuilder.group({
        image: [null]
      });
      this.submitAlbumData = this.formBuilder.group({
        title : ['',],
        id:[null],
        client_id:[null]
      });
    this.getMediaGaleeryData();
    this.showHide = false;
    this.isImageExist= false;
   }
   
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
    const formModel = this.mediaManagementForm.value;
    this.http.post("http://flujo.in/dashboard/flujo.in_api_client/mediamanagement", formModel).subscribe(
      res => {
        console.log(res);
        this.getMediaGaleeryData();
        this.mediaManagementForm=null;
        
        this.successMessage = "Images uploaded successfully";
        this.successMessagebool = true;
        this.alertService.success('Images uploaded successfully');
        

      },
      (err: HttpErrorResponse) => {
        // this.errMsg = err.message;
        console.log(err.error);
        console.log(err.name);
        console.log(err.message);
        console.log(err.status);
      }
    );
  }
  getMediaGaleeryData(){
    this.http
      .get<mediaDetail>('http://flujo.in/dashboard/flujo.in_api_client/mediagallery')
      .subscribe(
      // Successful responses call the first callback.
      data => {
        this.mediaData=data;
        console.log(this.mediaData);
      },
      
      err => {
        
      }
      );
  }
  getImageId(item_id){
    
    
    for(var i=0; i < this.albumObject.images.length; i++){
    this.albumImage = {id:item_id.id, description: item_id.id};
    this.albumObject.images.push(this.albumImage);

     console.log(this.albumObject);

    // this.submitAlbumData.get('id').setValue(this.albumImage = {id:item_id.id})
    
  }
}
  submitAlbumDataPost(body:any){
    const formModel = this.submitAlbumData.value;
    this.submitAlbumData.controls['client_id'].setValue(localStorage.getItem("client_id"));
    this.httpService.create(formModel, "/flujo_client_postgalleryimages")
    .subscribe(
        data => {
          console.log(this.submitAlbumData.value);
          if (data) {
            this.alertService.success('Social Links deleted Successfully');
          }
        },
        error => {
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
