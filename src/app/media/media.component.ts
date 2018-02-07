import { Component, OnInit, ElementRef, ViewChild, SimpleChanges, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Http, Headers, RequestOptions } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { mediaDetail } from '../model/feedback.model';
import { AlertModule, AlertService } from 'ngx-alerts';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { FileUploadModule } from "ng2-file-upload";
import { MatButtonModule } from '@angular/material';
import { IGalleryObject, IGalleryImageItem, IAlbumImageUpdate, IBase64Images } from '../model/gallery.model';
import { AppConstants } from '../app.constants';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EditGalleryItems } from '../directives/edit-gallery-popup/editgallery.popup';
import * as _ from 'underscore';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})

export class MediaComponent implements OnInit {

  tabindex: any;
  selectedTab: number;
  albumTitle: string;
  public originalAlbumData: any;
  hightlightStatus: Array<boolean> = [];
  public successMessage;
  public loading = false;

  public successMessagebool;
  public deleteMessage;
  public deleteMessagebool;
  public mediaData: mediaDetail;
  mediaManagementForm: any;
  showHide: boolean;
  submitAlbumData: FormGroup;
  albumObject: IGalleryObject;
  albumImages: Array<IGalleryImageItem>;
  albumGallery: IGalleryObject
  albumImage: IGalleryImageItem;
  albumImagesParsedArrayData: IAlbumImageUpdate;
  parseAlbumGalleryData: any;
  // albumGalleryIDsArry: Array<string>;
  isImageExist: boolean;
  albumItemForm: FormGroup;
  albumItem: any;
  albumGalleryItem: any;
  albumBase64imagesArray: Array<IAlbumImageUpdate>;
  albumBase64imagesObject: IAlbumImageUpdate;
  popUpAlbumDataItem: IAlbumImageUpdate;
  // image upload files styles
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
      "display": "none"
    },

  }
  constructor(public dialog: MatDialog, private spinnerService: Ng4LoadingSpinnerService, private httpClient: HttpClient, private formBuilder: FormBuilder, private alertService: AlertService) {

    this.mediaManagementForm = this.formBuilder.group({
      image: [null],
      client_id: [null]
    });
    this.submitAlbumData = this.formBuilder.group({
      title: ['', Validators.required],
      images: [null],
      client_id: [null]
    });
    this.getMediaGalleryData();



    this.albumItemForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      order: ['', Validators.required]
    });
  }


  ngOnInit() {

    this.getAlbumGallery();
    setTimeout(function () {
      this.spinnerService.hide();
    }.bind(this), 3000);
    this.albumObject = <IGalleryObject>{}
    this.albumObject.images = [];
  }
  selectMedia(event) {
    let imageDetail = [];
    if (event.target.files && event.target.files.length > 0) {

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
        this.successMessagebool = true;
        this.spinnerService.hide();
        this.mediaManagementForm = null;
        this.mediaManagementForm = null;
        this.successMessagebool = true;
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
  getMediaGalleryData() {
    this.spinnerService.show();
    this.httpClient
      .get<mediaDetail>(AppConstants.API_URL + 'flujo_client_mediagallery')
      .subscribe(
      data => {
        this.mediaData = data;
        this.spinnerService.hide();

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
          this.alertService.success('Social Links deleted Successfully');
          this.getMediaGalleryData();
        }
      },
      error => {
        this.spinnerService.hide();
        console.log(error);
      });

  }
  getImageId(item_id) {
    // this.albumObject = <IGalleryObject>{}
    // this.albumObject.images = [];
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
  //to create new album with title form from the html
  CreateNewAlbumForm(body: any) {


    this.albumObject.client_id = AppConstants.CLIENT_ID;
    this.albumObject.title = this.albumTitle;
    // this.albumObject.images = this.albumObject.images;
    this.spinnerService.show();
    // this.submitAlbumData.controls['images'].setValue(this.albumObject);
    // this.submitAlbumData.controls['client_id'].setValue(localStorage.getItem("client_id"));
    // let formModel = this.submitAlbumData.value;
    this.CreateNewAlbumHttpRequest(this.albumObject);
  }
  //http call for create a new gallery or update the exsiting gallery
  CreateNewAlbumHttpRequest(reqData) {
    this.httpClient.post(AppConstants.API_URL + "flujo_client_gallery", reqData)
      .subscribe(
      data => {

        this.submitAlbumData.reset();
        this.resetsubmitAlbumData();
        this.spinnerService.hide();
        if (this.tabindex) {
          this.reloadAlbumByIds();
        }
        if (data) {
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
  // setting submitalbum data form reset to null
  resetsubmitAlbumData() {
    this.albumObject = null;
    this.submitAlbumData.controls['images'].setValue(null);
    this.submitAlbumData.controls['title'].setValue(null);
    this.submitAlbumData.controls['client_id'].setValue(null);
    this.albumObject = <IGalleryObject>{}
    this.albumObject.images = [];

  }


  getAlbumGallery() {
    this.spinnerService.show();
    this.httpClient
      .get<IGalleryObject>(AppConstants.API_URL + 'flujo_client_gallery/' + AppConstants.CLIENT_ID)
      .subscribe(
      data => {
        this.albumGallery = data;
        this.spinnerService.hide();
        console.log(this.albumGallery);
        // console.log(this.albumGallery);


      },

      err => {
        this.spinnerService.hide();
      }
      );
  }
  // parsing the AlbumGallery object for getting the album ids.
  prepareAlbumGalleryIdsObject(albumItems) {

    this.parseAlbumGalleryData = JSON.parse(albumItems);

    // this.albumImagesParsedArrayData = albumItemsJson.images;
    let albumGalleryIDsArry = [];
    _.each(this.parseAlbumGalleryData, (item) => {

      albumGalleryIDsArry.push(item.id);

    });
    return albumGalleryIDsArry;
  }
  //getting album gallery images by album id
  getAlbumGalleryImagesByIds(albumImageIds, albumid) {
    
    if (albumImageIds.length > 0) {
      this.spinnerService.show();
      this.httpClient.post<IBase64Images>("http://www.flujo.in/dashboard/flujo.in_keerthan/flujo-client-api/flujo_client_image", albumImageIds)
        .subscribe(
        data => {
          //this.prepareAlbumBase64ImagesObject(this.albumImagesParsedArrayData, data);

          this.albumGalleryItem = data;

          this.spinnerService.hide();
        },

        err => {
          this.spinnerService.hide();
        });
    } else {
      console.log(albumid);
      _.each(this.albumGallery, (iteratee, index) => {
        if (iteratee.id == albumid) {
          this.albumGallery[index].images = this.originalAlbumData.images;
        }
      });
      //this.albumGallery[0].images = this.originalAlbumData.images; 
      console.log(this.albumGallery[0].images);
      this.albumGalleryItem = null;
      
      this.alertService.danger("no album found. please add images.");
    }


  }
  //getting single album gallery details by album id
  // getAlbumGalleryById(albumId): any {
  //   this.spinnerService.show();
  //   this.httpClient.get<IGalleryObject>(AppConstants.API_URL + "flujo_client_getgallery/" + albumId)
  //     .subscribe(
  //     data => {


  //       // this.albumGalleryItem = data;

  //       this.spinnerService.hide();
  //       return data;
  //     },

  //     err => {
  //       this.spinnerService.hide();
  //     });

  // }
  openDialog(albumItem): void {
    this.albumObject = this.originalAlbumData;
    // this.albumItem = albumItem;

    if (albumItem) {
      var filteredimagesArray = _.filter(this.parseAlbumGalleryData, (num) => {
        return num.id == albumItem.id
      });
      let popupData = this.prepareAlbumBase64ImagesObject(filteredimagesArray, albumItem);

      let dialogRef = this.dialog.open(EditGalleryItems, {
        data: popupData
        // height: "400px",
        // width:"600px"
      });
      dialogRef.afterClosed().subscribe(result => {
        //prepare POST request object for updating the particular album details
        if (result) {
          var filteredimagesArray = _.filter(this.parseAlbumGalleryData, (num) => {
            return num.id != result.id
          });

          console.log(filteredimagesArray);
          this.albumObject = <IGalleryObject>{}
          this.albumObject.images = [];
          this.albumObject.id = this.originalAlbumData.id;
          this.albumObject.title = this.originalAlbumData.title;
          this.albumObject.client_id = this.originalAlbumData.client_id;
          this.albumObject.images.push(result);
          _.each(filteredimagesArray, (item) => {
            this.albumObject.images.push(item);
          })
          this.CreateNewAlbumHttpRequest(this.albumObject);

        }

      });
    }
  }
  //prepare album object with title desc, images,order to bind in html
  prepareAlbumBase64ImagesObject(albumdetals: IAlbumImageUpdate, base64images: IBase64Images) {
    // this.albumBase64imagesArray = <Array<IAlbumImageUpdate>>{};

    this.albumBase64imagesObject = <IAlbumImageUpdate>{};
    this.albumBase64imagesArray = [];

    _.each(albumdetals, (ablmbetail, item_index) => {

      if (albumdetals[item_index].id == base64images.id) {
        this.albumBase64imagesObject = { id: albumdetals[item_index].id, title: albumdetals[item_index].title, description: albumdetals[item_index].description, image: base64images.image };
        this.albumBase64imagesArray.push(this.albumBase64imagesObject);
      }

    })

    return this.albumBase64imagesArray;

  }
  tabChanged(tabItem) {
    this.tabindex = tabItem.index;
    this.originalAlbumData = this.albumGallery[tabItem.index - 1];
    if (tabItem.index != 0) {
      let firstAlbumData = this.prepareAlbumGalleryIdsObject(this.albumGallery[tabItem.index - 1].images);

      this.getAlbumGalleryImagesByIds(firstAlbumData, this.albumGallery[tabItem.index - 1].id);
    } else {
      this.getMediaGalleryData();
    }
  }
  //call from html ------  delete function to delete the album single image details.........
  deleteGalleryItem(albumItem) {
    // this.selectedTab = 3;
    let dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        if (albumItem) {
          var filteredimagesArray = _.filter(this.parseAlbumGalleryData, (num) => {
            return num.id != albumItem.id
          });
          this.albumObject = <IGalleryObject>{}
          this.albumObject.images = [];
          this.albumObject.id = this.originalAlbumData.id;
          this.albumObject.title = this.originalAlbumData.title;
          this.albumObject.client_id = this.originalAlbumData.client_id;
          //this.albumObject.images.push(result);
          _.each(filteredimagesArray, (item) => {
            this.albumObject.images.push(item);
          })
          let result = this.CreateNewAlbumHttpRequest(this.albumObject);

        }
      }

    });
  }

  reloadAlbumByIds() {
    // var ttttt = this.getAlbumGalleryById(this.originalAlbumData.id);
    this.spinnerService.show();
    this.httpClient.get<IGalleryObject>(AppConstants.API_URL + "flujo_client_getgallery/" + this.originalAlbumData.id)
      .subscribe(
      data => {

        this.originalAlbumData = data[0];
        if (this.tabindex != 0) {
          let firstAlbumData = this.prepareAlbumGalleryIdsObject(this.originalAlbumData.images);

          this.getAlbumGalleryImagesByIds(firstAlbumData, this.originalAlbumData.id);


        } else {
          this.getMediaGalleryData();
        }
        this.spinnerService.hide();

      },

      err => {
        this.spinnerService.hide();
      });
  }
}




@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'media-delete.popup.html',
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}