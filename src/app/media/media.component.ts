import { Component, OnInit, ElementRef, ViewChild, SimpleChanges, Inject, HostListener, EventEmitter, Input, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Http, Headers, RequestOptions } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
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
import { AdminComponent } from '../admin/admin.component';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { ICommonInterface } from '../model/commonInterface.model';


@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})

export class MediaComponent implements OnInit {
  myGroup: FormGroup;
  popupFileUploadData = {};
  imageDetail: any = [];
  albumTitles: string;
  uploadImagesForm: FormGroup;
  toggleFileUploader = false;
  filteredUserAccessData: any;
  userAccessLevelObject: any;
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
  isshowAlbumGallery: boolean;
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
    private httpClient: HttpClient, private formBuilder: FormBuilder, private alertService: AlertService,
    public adminComponent: AdminComponent, private router: Router) {

    this.myGroup = new FormGroup({
      AlbumName: new FormControl(),
      Album: new FormControl(),
      description: new FormControl()
    });

    this.uploadImagesForm = this.formBuilder.group({
      image: [null],
      client_id: [null]
    });

    this.albumItemForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      order: ['', Validators.required]
    });
    if (this.adminComponent.userAccessLevelData) {
      this.userRestrict();
    } else {
      this.adminComponent.getUserAccessLevelsHttpClient()
        .subscribe(
          resp => {
            this.spinnerService.hide();
            _.each(resp, item => {
              if (item.user_id === localStorage.getItem('user_id')) {
                this.userAccessLevelObject = item.access_levels;
              }
            });
            this.adminComponent.userAccessLevelData = JSON.parse(this.userAccessLevelObject);
            this.userRestrict();
          },
          error => {
            console.log(error);
            this.spinnerService.hide();
          }
        );
    }
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
  // this for restrict user on root access level
  userRestrict() {
    _.each(this.adminComponent.userAccessLevelData, (item, iterate) => {
      // tslint:disable-next-line:max-line-length
      if (this.adminComponent.userAccessLevelData[iterate].name === 'Media Management' && this.adminComponent.userAccessLevelData[iterate].enable) {
        this.filteredUserAccessData = item;
      } else {

      }
    });
    if (this.filteredUserAccessData) {
      this.router.navigate(['admin/media']);
    } else {
      this.router.navigate(['/accessdenied']);
    }
  }
  selectMedia(event) {
    this.ishide = false;
    if (event.target.files && event.target.files.length > 0) {

      for (let i = 0; i < event.target.files.length; i++) {
        const reader = new FileReader();
        const file = event.target.files[i];
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.imageDetail.push(reader.result.split(',')[1]);
          console.log(this.imageDetail);
        };
      }
      this.openFileDialog(this.imageDetail);
      try {
        this.uploadImagesObject.image = this.imageDetail;
      } catch (e) {
        console.log(e);
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

  filterAlbumTitlesPopup(option: string) {
    // tslint:disable-next-line:no-shadowed-variable
    return this.popupFileUploadData['options'].filter(option =>
      option.toLowerCase().indexOf(option.toLowerCase()) === 0);
  }

  // Popup for file uploading
  openFileDialog(imageDetail): void {

    this.popupFileUploadData['images'] = imageDetail;
    this.popupFileUploadData['options'] = this.albumGallery;

    const dialogRef = this.dialog.open(FileSelectPopup, {
      width: '80vw',
      data: this.popupFileUploadData
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed 1');
    });
  }

  // this function used to upload the image or multiple images
  onUploadImages() {
    this.spinnerService.show();

    this.uploadImagesObject.client_id = AppConstants.CLIENT_ID;
    this.httpClient.post<ICommonInterface>(AppConstants.API_URL + 'flujo_client_postgallery', this.uploadImagesObject).subscribe(
      res => {
        if (res.access_token === AppConstants.ACCESS_TOKEN) {
          if ((!res.error) && (res.custom_status_code = 100)) {
          this.uploadImagesObject = <IUploadImages>{};
          this.successMessagebool = true;
          this.spinnerService.hide();

          this.successMessagebool = true;
          this.alertService.success('Images uploaded successfully');
          this.getMediaGalleryData();
        } else if ((res.error) && (res.custom_status_code = 101)) {
          this.alertService.warning('Required parameters are missing');
        }
        }
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

      .get<ICommonInterface>(AppConstants.API_URL + 'flujo_client_getgallery/' + AppConstants.CLIENT_ID)
      .subscribe(
        data => {
          this.mediaData = data.result;
          this.spinnerService.hide();
        },

        err => {
          this.spinnerService.hide();
        }
      );
  }
  deleteMediaImage(image_id) {
    this.spinnerService.show();
    this.httpClient.delete<ICommonInterface>(AppConstants.API_URL + 'flujo_client_deletegallery/' + image_id)
      .subscribe(
        data => {
          if (data.access_token === AppConstants.ACCESS_TOKEN) {
            if ((!data.error) && (data.custom_status_code = 100)) {
              this.hightlightStatus = [false];
              this.spinnerService.hide();
              this.alertService.success('Image deleted Successfully');
              this.getMediaGalleryData();
            } else if ((data.error) && (data.custom_status_code = 101)) {
              this.alertService.warning('Required parameters are missing');
            }
          }
        },
        error => {
          this.spinnerService.hide();
          console.log(error);
        });

  }

  // this functon is used for getting the image id to insert into the group of album
  getImageId(item_id: IGalleryObject) {

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
    this.albumImagesArraySize = _.size(this.albumObject.images);
  }

  // to create new album with title form from the html
  CreateNewAlbumForm(body: any) {
    this.albumObject.client_id = AppConstants.CLIENT_ID;
    this.albumObject.title = this.albumTitle;

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

    this.httpClient.post<ICommonInterface>(AppConstants.API_URL + 'flujo_client_postalbum', reqData)
      .subscribe(
        data => {

          if ((!data.error) && (data.custom_status_code = 100)) {

            this.resetsubmitAlbumData();
            this.spinnerService.hide();

            this.parseReloadAlbumGalleryObject(data.result);

            this.hightlightStatus = [false];
            this.alertService.success('Album created successfully.');
          } else if ((data.error) && (data.custom_status_code = 101)) {
            this.spinnerService.hide();
            this.alertService.danger('Something went wrong.please try again.');
          }
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

    this.albumObject = <IGalleryObject>{};
    this.albumObject.images = [];

  }


  getAlbumGallery() {

    this.spinnerService.show();
    this.httpClient
      .get<ICommonInterface>(AppConstants.API_URL + 'flujo_client_getalbum/' + AppConstants.CLIENT_ID)
      .subscribe(
        data => {
          if (data.access_token === AppConstants.ACCESS_TOKEN) {
            if ((!data.error) && (data.custom_status_code = 100)) {
          this.albumGallery = data.result;
          this.spinnerService.hide();

          this.prepareAllAlbumImageIdsArray(data.result);
        } else if ((data.error) && (data.custom_status_code = 101) ) {
          this.alertService.danger('Required parameters are missing.');
        }
        }
        },

        err => {
          this.spinnerService.hide();
        }
      );
  }
  // parsing the AlbumGallery object for getting the album ids.
  prepareAlbumGalleryIdsObject(albumItems) {

    this.parseAlbumGalleryData = JSON.parse(albumItems);

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
      this.httpClient.post<ICommonInterface>(AppConstants.API_URL + 'flujo_client_getgalleryintoalbum', albumImageIds)
        .subscribe(
          data => {

            this.albumGalleryItem = data.result;

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

      console.log(this.albumGallery[0].images);
      this.albumGalleryItem = null;

      this.alertService.danger('no album found. please add images.');
    }


  }

  openDialog(albumItem): void {
    this.albumObject = this.originalAlbumData;

    if (albumItem) {
      console.log(this.parseAlbumGalleryData);
      const filteredimagesArray = _.filter(this.parseAlbumGalleryData, (num) => {
        return num.id === albumItem.id;
      });
      console.log(filteredimagesArray);
      const popupData = this.prepareAlbumBase64ImagesObject(filteredimagesArray, albumItem);

      const dialogRef = this.dialog.open(EditGalleryItems, {
        data: popupData,
        height: '400px',
        width: '600px'
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
  }
  UsedImages = () => {
    this.usedActiveButton = true;
    this.unUsedActiveButton = false;
    this.isViewUsedUnUsedImages = true;
    this.usedImageIdsArray = _.uniq(this.allAlbumImageIdsArray);

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
  selectedOption: any;
  stateCtrl: FormControl;
  filteredStates: Observable<any[]>;
  description: string;
  sendData: any = {};
  constructor(
    public dialogRef: MatDialogRef<FileSelectPopup>,
    @Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient, private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertService) {

    dialogRef.disableClose = true;
    this.stateCtrl = new FormControl();
    this.filteredStates = this.stateCtrl.valueChanges
      .pipe(
        startWith(''),
        map(state => state ? this.filterStates(state) : state.slice())
      );
    console.log(this.filteredStates);
  }

  filterStates(name: string) {
    return this.data.options.filter(state =>
      state.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  displayFn(project): string {
    return project ? project.title : project;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  closeDialog() {
    this.dialogRef.close();
  }

  saveFiles() {
    this.spinnerService.show();
    if (this.data.images.length > 1) {
      this.sendData.id = this.selectedOption.id;
      this.sendData.title = this.selectedOption.title;
    }
    this.sendData.description = this.description;
    this.sendData.images = this.data.images;
    this.sendData.client_id = AppConstants.CLIENT_ID;
    console.log(this.sendData);

    this.http.post(AppConstants.API_URL + '/flujo_client_postalbumgallery', this.sendData).subscribe(
      res => {
        this.spinnerService.hide();
        this.alertService.success('Uploaded successfully');
        this.dialogRef.close();
      },
      (err: HttpErrorResponse) => {
        this.spinnerService.hide();
        this.alertService.warning('Something went wrong.');
      }
    );
  }

}
