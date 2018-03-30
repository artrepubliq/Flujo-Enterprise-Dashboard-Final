import { Component, OnInit, ElementRef, ViewChild, SimpleChanges, Inject, HostListener, EventEmitter, Input, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Http, Headers, RequestOptions } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { mediaDetail } from '../model/feedback.model';
import { AlertModule, AlertService } from 'ngx-alerts';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { FileUploadModule } from 'ng2-file-upload';
import { MatButtonModule } from '@angular/material';
import { IGalleryObject, IGalleryImageItem, IAlbumImageUpdate, IBase64Images, IUploadImages } from '../model/gallery.model';
import { AppConstants } from '../app.constants';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EditGalleryItems } from '../directives/edit-gallery-popup/editgallery.popup';
import * as _ from 'underscore';
import { FileHolder } from 'angular2-image-upload';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})

export class MediaComponent implements OnInit {
  toggleFileUploader: boolean = false;
  unUsedActiveButton: boolean;
  isViewUsedUnUsedImages = false;
  usedUnUsedMedia: mediaDetail[];
  isAlbumObjectsPresentAlert = true;
  albumImagesArraySize: any;
  usedActiveButton: boolean;
  tabindex: any;
  selectedTab: number;
  albumTitle: string;
  public originalAlbumData: any;
  hightlightStatus: Array<boolean> = [];
  public successMessage;
  public loading = false;
  ishide: boolean;
  public successMessagebool;
  public deleteMessage;
  public deleteMessagebool;
  public mediaData: Array<mediaDetail>;
  public unUsedMediaData: Array<mediaDetail>;
  public usedMediaData: Array<mediaDetail>;
  public allAlbumImageIdsArray;
  public usedImageIdsArray;
  public unUsedImageIdsArray;
  uploadImagesObject: IUploadImages;
  dragAreaClass = 'dragarea';
  showHide: boolean;
  // submitAlbumData: FormGroup;
  albumObject: IGalleryObject;
  albumImages: Array<IGalleryImageItem>;
  albumGallery: Array<IGalleryObject>;
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
      'border-radius': '20px',
      'background-color': '#ee286b',
      'box-shadow': '0 1.5px 18px 0 rgba(0, 0, 0, 0.15)',
      'font-size': '14px',
      'font-weight': '500',
      'text-align': 'center',
      'color': '#ffffff',
      'text-transform': 'initial',
      'font-family': 'Roboto',
      'width': '130px',
      'height': '40px',
      'float': 'right'
    },
    clearButton: {
      'border-radius': '20px',
      'background-color': '#ee286b',
      'box-shadow': '0 1.5px 18px 0 rgba(0, 0, 0, 0.15)',
      'font-size': '14px',
      'font-weight': '500',
      'text-align': 'center',
      'color': '#ffffff',
      'text-transform': 'initial',
      'font-family': 'Roboto',
      'width': '130px',
      'height': '40px',
      'float': 'right'
    },
    layout: {
      'border-radius': '5px',
      'background-color': 'transparent',
      'border': 'dashed 1.5px #91d7ea'
    },
    previewPanel: {
      'background-color': 'transparent',
      'border-radius': '0 0 25px 25px',
    },
    dropBoxMessage: {
      'font-family': 'Roboto',
      'font-size': '15px',
      'font-weight': '500',
      'text-align': 'center',
      'color': 'red',
      'display': 'none'
    },

  };
  public dragging: boolean;
  constructor(public dialog: MatDialog, private spinnerService: Ng4LoadingSpinnerService,
    private httpClient: HttpClient, private formBuilder: FormBuilder, private alertService: AlertService) {
    this.albumItemForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      order: ['', Validators.required]
    });
  }
  ngOnInit() {
    this.uploadImagesObject = <IUploadImages>{};
    this.ishide = true;
    this.getMediaGalleryData();
    this.getAlbumGallery();
    setTimeout(function () {
      this.spinnerService.hide();
    }.bind(this), 3000);
    this.albumObject = <IGalleryObject>{};
    this.albumObject.images = [];
  }
  selectMedia(event) {
    const imageDetail = [];
    this.ishide = false;
    if (event.target.files && event.target.files.length > 0) {

      for (let i = 0; i < event.target.files.length; i++) {
        const reader = new FileReader();
        const file = event.target.files[i];
        reader.readAsDataURL(file);
        reader.onload = () => {
          imageDetail.push(reader.result.split(',')[1]);
          // this.imagePreview = imageDetail;
          // console.log(this.imagePreview);
          // this.openFileDialog(imageDetail);
        };
      }
      try {
        this.uploadImagesObject.image = imageDetail;
      } catch (e) {

      }
    }
  }
  onRemoved(file: FileHolder) {
    this.ishide = true;
    // do some stuff with the removed file.
  }
  onUploadStateChanged(state: boolean) {
    console.log(JSON.stringify(state));
  }
  // Popup for file uploading
  // openFileDialog(imageDetail): void {
  //   let dialogRef = this.dialog.open(FileSelectPopup, {
  //     width: '80vw',
  //     data: imageDetail,
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //   });
  // }
  // this function used to upload the image or multiple images
  onUploadImages(body: any) {
    this.spinnerService.show();

    this.uploadImagesObject.client_id = AppConstants.CLIENT_ID;
    this.httpClient.post(AppConstants.API_URL + 'flujo_client_postgallery', this.uploadImagesObject).subscribe(
      res => {
        this.uploadImagesObject = <IUploadImages>{};
        this.successMessagebool = true;
        this.spinnerService.hide();

        this.successMessagebool = true;
        this.alertService.success('Images uploaded successfully');
        this.getMediaGalleryData();

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

      .get<Array<mediaDetail>>(AppConstants.API_URL + 'flujo_client_getgallery/' + AppConstants.CLIENT_ID)
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
    this.httpClient.delete(AppConstants.API_URL + 'flujo_client_deletegallery/' + image_id)
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

  // this functon is used for getting the image id to insert into the group of album
  getImageId(item_id: IGalleryObject) {
    // this.albumObject = <IGalleryObject>{}
    // this.albumObject.images = [];
    const item_index = _.findWhere(this.albumObject.images, {
      id: item_id.id
    });

    if (item_index) {
      this.albumObject.images = _.without(this.albumObject.images, item_index);
    } else {
      this.albumImage = <IGalleryImageItem>{};
      this.albumImage.id = item_id.id;
      this.albumImage.title = null;
      this.albumImage.description = null;
      this.albumObject.images.push(this.albumImage);
    }
    // var item_index = _.without(this.albumObject.images, {id:item_id.id});
    // console.log(item_index);

    this.albumImagesArraySize = _.size(this.albumObject.images);


    // if (item_index != -1) {
    //   this.albumObject.images.splice(item_index, 1);

    // } else {
    //   this.albumObject.images.push(this.albumImage);
    //   console.log(this.albumObject);
    // }
  }
  // to create new album with title form from the html
  CreateNewAlbumForm(body: any) {
    this.albumObject.client_id = AppConstants.CLIENT_ID;
    this.albumObject.title = this.albumTitle;
    // this.albumObject.images = this.albumObject.images;

    // this.submitAlbumData.controls['images'].setValue(this.albumObject);
    // this.submitAlbumData.controls['client_id'].setValue(localStorage.getItem("client_id"));
    // let formModel = this.submitAlbumData.value;
    if (this.albumObject.title != null && this.albumImagesArraySize >= 2) {
      this.isAlbumObjectsPresentAlert = true;
      this.CreateNewAlbumHttpRequest(this.albumObject);
    } else {
      this.isAlbumObjectsPresentAlert = false;
    }

  }
  // http call for create a new gallery or update the exsiting gallery
  CreateNewAlbumHttpRequest(reqData) {
    this.spinnerService.show();

    this.httpClient.post(AppConstants.API_URL + 'flujo_client_postalbum', reqData)
      .subscribe(
      data => {

        if (data) {
          // this.submitAlbumData.reset();
          this.resetsubmitAlbumData();
          this.spinnerService.hide();
          // this.getAlbumGallery();
          this.parseReloadAlbumGalleryObject(data);
          // this.parseUpdatedAlbumData(data);
          this.hightlightStatus = [false];
          this.alertService.success('Album created successfully.');
        } else {
          this.spinnerService.hide();
          this.alertService.danger('Something went wrong.please try again.');
        }


        // if (this.tabindex) {
        //   this.reloadAlbumByIds();
        // }

      },
      error => {
        this.spinnerService.hide();
        this.alertService.danger('Something went wrong.please try again.');
        console.log(error);
      });
  }
  // setting submitalbum data form reset to null
  resetsubmitAlbumData() {
    this.albumObject = null;
    this.albumTitle = null;
    // this.submitAlbumData.controls['images'].setValue(null);
    // this.submitAlbumData.controls['title'].setValue(null);
    // this.submitAlbumData.controls['client_id'].setValue(null);
    this.albumObject = <IGalleryObject>{};
    this.albumObject.images = [];

  }


  getAlbumGallery() {

    this.spinnerService.show();
    this.httpClient
      .get<Array<IGalleryObject>>(AppConstants.API_URL + 'flujo_client_getalbum/' + AppConstants.CLIENT_ID)
      .subscribe(
      data => {
        this.albumGallery = data;
        this.spinnerService.hide();
        // console.log(this.albumGallery[0].id);
        // console.log(this.albumGallery);
        this.prepareAllAlbumImageIdsArray(data);

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
    const albumGalleryIDsArry = [];
    _.each(this.parseAlbumGalleryData, (item) => {

      albumGalleryIDsArry.push(item.id);

    });
    return albumGalleryIDsArry;
  }
  // getting album gallery images by album id
  getAlbumGalleryImagesByIds(albumImageIds, albumid) {

    if (albumImageIds.length > 0) {
      this.spinnerService.show();
      this.httpClient.post<IBase64Images>(AppConstants.API_URL + 'flujo_client_getgalleryintoalbum', albumImageIds)
        .subscribe(
        data => {
          // this.prepareAlbumBase64ImagesObject(this.albumImagesParsedArrayData, data);

          this.albumGalleryItem = data;

          this.spinnerService.hide();
        },

        err => {
          this.spinnerService.hide();
        });
    } else {
      console.log(albumid);
      _.each(this.albumGallery, (iteratee, index) => {
        if (iteratee.id === albumid) {
          this.albumGallery[index].images = this.originalAlbumData.images;
        }
      });
      // this.albumGallery[0].images = this.originalAlbumData.images;
      console.log(this.albumGallery[0].images);
      this.albumGalleryItem = null;

      this.alertService.danger('no album found. please add images.');
    }


  }

  openDialog(albumItem): void {
    this.albumObject = this.originalAlbumData;
    // this.albumItem = albumItem;
    // this.prepareAlbumGalleryIdsObject();
    if (albumItem) {
      console.log(this.parseAlbumGalleryData);
      const filteredimagesArray = _.filter(this.parseAlbumGalleryData, (num) => {
        return num.id === albumItem.id;
      });
      console.log(filteredimagesArray);
      const popupData = this.prepareAlbumBase64ImagesObject(filteredimagesArray, albumItem);

      const dialogRef = this.dialog.open(EditGalleryItems, {
        data: popupData
        // height: "400px",
        // width:"600px"
      });
      dialogRef.afterClosed().subscribe(result => {

        // prepare POST request object for updating the particular album details
        if (result) {
          console.log(this.parseAlbumGalleryData);
          // tslint:disable-next-line:no-shadowed-variable
          const filteredimagesArray = _.filter(this.parseAlbumGalleryData, (num) => {
            return num.id !== result.id;
          });
          console.log(filteredimagesArray);
          console.log(filteredimagesArray);
          this.albumObject = <IGalleryObject>{};
          this.albumObject.images = [];
          this.albumObject.id = this.originalAlbumData.id;
          this.albumObject.title = this.originalAlbumData.title;
          this.albumObject.client_id = this.originalAlbumData.client_id;
          this.albumObject.images.push(result);
          _.each(filteredimagesArray, (item) => {
            this.albumObject.images.push(item);
          });
          this.CreateNewAlbumHttpRequest(this.albumObject);

        }

      });
    }
  }
  // prepare album object with title desc, images,order to bind in html
  prepareAlbumBase64ImagesObject(albumdetals: IAlbumImageUpdate, base64images: IBase64Images) {
    // this.albumBase64imagesArray = <Array<IAlbumImageUpdate>>{};

    this.albumBase64imagesObject = <IAlbumImageUpdate>{};
    this.albumBase64imagesArray = [];

    _.each(albumdetals, (ablmbetail, item_index) => {

      if (albumdetals[item_index].id === base64images.id) {
        this.albumBase64imagesObject = {
          id: albumdetals[item_index].id,
          title: albumdetals[item_index].title, description: albumdetals[item_index].description,
          order: albumdetals[item_index].order, image: base64images.image
        };
        this.albumBase64imagesArray.push(this.albumBase64imagesObject);
      }

    });

    return this.albumBase64imagesArray;

  }
  tabChanged(tabItem) {
    this.isViewUsedUnUsedImages = false;
    this.tabindex = tabItem.index;
    this.originalAlbumData = this.albumGallery[tabItem.index - 1];
    if (tabItem.index !== 0) {
      const firstAlbumData = this.prepareAlbumGalleryIdsObject(this.albumGallery[tabItem.index - 1].images);

      this.getAlbumGalleryImagesByIds(firstAlbumData, this.albumGallery[tabItem.index - 1].id);
    } else {
      this.getMediaGalleryData();
    }
  }
  // call from html ------  delete function to delete the album single image details.........
  deleteGalleryItem(albumItem) {
    // this.selectedTab = 3;
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        if (albumItem) {
          console.log(this.parseAlbumGalleryData);
          const filteredimagesArray = _.filter(this.parseAlbumGalleryData, (num) => {
            return num.id !== albumItem.id;
          });
          console.log(filteredimagesArray);
          this.albumObject = <IGalleryObject>{};
          this.albumObject.images = [];
          this.albumObject.id = this.originalAlbumData.id;
          this.albumObject.title = this.originalAlbumData.title;
          this.albumObject.client_id = this.originalAlbumData.client_id;
          // this.albumObject.images.push(result);
          _.each(filteredimagesArray, (item) => {
            this.albumObject.images.push(item);
          });
          // tslint:disable-next-line:no-shadowed-variable
          const result = this.CreateNewAlbumHttpRequest(this.albumObject);

        }
      }

    });
  }

  // parse the updated data in perticular album
  parseUpdatedAlbumData(data) {
    if (data.client_id) {
      this.originalAlbumData = data;
      if (this.tabindex !== 0) {
        const firstAlbumData = this.prepareAlbumGalleryIdsObject(this.originalAlbumData.images);

        this.getAlbumGalleryImagesByIds(firstAlbumData, this.originalAlbumData.id);


      } else {
        this.getMediaGalleryData();
      }
    }
  }
  reloadAlbumByIds() {
    // var ttttt = this.getAlbumGalleryById(this.originalAlbumData.id);
    this.spinnerService.show();
    this.httpClient.get<IGalleryObject>(AppConstants.API_URL + 'flujo_client_getgallery/' + this.originalAlbumData.id)
      .subscribe(
      data => {
        this.parseReloadAlbumGalleryObject(data[0]);
        this.spinnerService.hide();
      },

      err => {
        this.spinnerService.hide();
      });
  }
  parseReloadAlbumGalleryObject(data) {
    if (data.client_id) {
      this.originalAlbumData = data;
      if (this.tabindex !== 0) {
        const firstAlbumData = this.prepareAlbumGalleryIdsObject(this.originalAlbumData.images);

        this.getAlbumGalleryImagesByIds(firstAlbumData, this.originalAlbumData.id);


      } else {
        this.getMediaGalleryData();
      }
    } else if (data.result) {
    } else {
      this.getAlbumGallery();
    }

  }
  // prepareing array of images from original album data fetched from the server.
  prepareAllAlbumImageIdsArray(data: Array<IGalleryObject>) {
    this.usedImageIdsArray = [];
    this.unUsedImageIdsArray = [];
    this.allAlbumImageIdsArray = [];
    _.each(data, (iteratee, index) => {
      const preparedImgsArray = this.prepareAlbumGalleryIdsObject(data[index].images);
      _.each(preparedImgsArray, (item) => {
        this.allAlbumImageIdsArray.push(item);
      });
    });
    // this.UsedImages();
    // this.UnUsedImages();
  }
  UsedImages = () => {
    this.usedActiveButton = true;
    this.unUsedActiveButton = false;
    this.isViewUsedUnUsedImages = true;
    this.usedImageIdsArray = _.uniq(this.allAlbumImageIdsArray);
    //  console.log(this.usedImageIdsArray);
    this.usedMediaData = [];
    _.each(this.usedImageIdsArray, (item) => {

      _.each(this.mediaData, (mediaUsedItem) => {
        if (mediaUsedItem.id === item) {
          this.usedMediaData.push(mediaUsedItem);
        }
      });
    });
    this.usedUnUsedMedia = this.usedMediaData;
    console.log(this.usedMediaData);
  }
  UnUsedImages = () => {
    this.usedActiveButton = false;
    this.unUsedActiveButton = true;
    this.isViewUsedUnUsedImages = true;
    this.usedImageIdsArray = _.uniq(this.allAlbumImageIdsArray);
    let allImageIds: Array<any>;
    allImageIds = [];
    _.each(this.mediaData, (item) => {
      allImageIds.push(item.id);
    });
    const unUsedImageIdsArray = _.difference(allImageIds, this.usedImageIdsArray);

    this.unUsedMediaData = [];

    _.each(unUsedImageIdsArray, (item) => {

      _.each(this.mediaData, (mediaItem) => {
        if (mediaItem.id === item) {
          this.unUsedMediaData.push(mediaItem);
        }
      });

    });
    this.usedUnUsedMedia = this.unUsedMediaData;
    console.log(this.unUsedMediaData);
  }

  uploadFile() {
    this.toggleFileUploader = !this.toggleFileUploader;
  }

}



@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'media-delete.popup.html',
})
// tslint:disable-next-line:component-class-suffix
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-overview-example-file-dialog',
  templateUrl: 'file-select.popup.html',
})
// tslint:disable-next-line:component-class-suffix
export class FileSelectPopup {

  constructor(
    public dialogRef: MatDialogRef<FileSelectPopup>,
    @Inject(MAT_DIALOG_DATA) public data: any) { dialogRef.disableClose = true; }

  onNoClick(): void {
    console.log(this.data);
    this.dialogRef.close();
  }

}
