import { Component, OnInit, ElementRef, ViewChild, SimpleChanges, Inject, HostListener, EventEmitter, Input, Output } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Http, Headers, RequestOptions } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { AlertModule, AlertService } from 'ngx-alerts';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { FileUploadModule } from 'ng2-file-upload';
import { MatButtonModule } from '@angular/material';
import { IGalleryObject, IGalleryImageItem, IAlbumImageUpdate, IBase64Images, IUploadImages, MediaDetail } from '../model/gallery.model';
import { AppConstants } from '../app.constants';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EditGalleryItems } from '../directives/edit-gallery-popup/editgallery.popup';
import * as _ from 'underscore';

import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { ICommonInterface } from '../model/commonInterface.model';
import { FileSelectPopup } from '../dialogs/media-file-select.popup/media-file-select.popup';
import { MediaDeletePopup } from '../dialogs/media-delete-popup/media-delete.popup';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})

export class MediaComponent implements OnInit {
  createAlbumController = new FormControl();
  albumCreateoptions: string[] = [];
  filteredAlbumOptions: Observable<string[]>;


  final_images: any[];
  test: any[];
  imageSize: any;
  imageName: any;
  errors: any[];
  myGroup: FormGroup;
  popupFileUploadData = {};
  imageDetail: any[];
  albumTitles: string;
  uploadImagesForm: FormGroup;
  toggleFileUploader = false;
  filteredUserAccessData: any;
  userAccessLevelObject: any;
  isAlbumObjectsPresentAlert = true;
  albumImagesArraySize: any;
  tabindex = 0;
  selectedTab: number;
  public originalAlbumData: any;
  hightlightStatus: Array<boolean> = [];
  public successMessage;
  public loading = false;
  ishide: boolean;
  public file_name_control;
  public successMessagebool;
  public deleteMessage;
  public deleteMessagebool;
  public mediaData: Array<MediaDetail>;
  public displayableMediaData: Array<MediaDetail>;
  public allAlbumImageIdsArray;
  isshowAlbumGallery: boolean;
  uploadImagesObject: IUploadImages;
  dragAreaClass = 'dragarea';
  showHide: boolean;
  albumObject: IGalleryObject;
  albumImages: Array<IGalleryImageItem>;
  albumGallery: Array<IGalleryObject>;
  albumImage: IGalleryImageItem;
  albumImagesParsedArrayData: IAlbumImageUpdate;
  parseAlbumGalleryData: any;
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
      'float': 'right',
      'display': 'none'
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
  @Input() maxFiles = 10;
  @Input() fileExt = 'JPG, PNG, JPEG';
  @Output() uploadStatus = new EventEmitter();
  @Input() maxSize = 2; // 5MB
  public dragging: boolean;
  constructor(public dialog: MatDialog, private spinnerService: Ng4LoadingSpinnerService,
    private httpClient: HttpClient, private formBuilder: FormBuilder, private alertService: AlertService,
    private router: Router) {

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
  }
  ngOnInit() {
    this.filteredAlbumOptions = this.createAlbumController.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter(value))
    );

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

  private _filter(value: string): string[] {
    try {
      const filterValue = value.toLowerCase();
          return this.albumCreateoptions.filter(option => option.toLowerCase().includes(filterValue));
    } catch (err) {
      console.log(err);
    }
  }
  selectMedia(event) {
    this.ishide = false;
    if (event.target.files && event.target.files.length > 0) {

      const files = event.target.files;
      this.saveFiles(files);

      this.imageDetail = Object.values(files);
      this.final_images = [];
      if (this.errors.length === 0) {
        console.log(this.albumGallery);
        this.openFileDialog(this.imageDetail);
      }
      console.log(this.errors);
      try {
        this.uploadImagesObject.image = this.imageDetail;
      } catch (e) {
        console.log(e);
      }
    }
  }

  @HostListener('dragover', ['$event']) onDragOver(event) {
    this.dragAreaClass = 'droparea';
    event.preventDefault();
  }

  @HostListener('dragenter', ['$event']) onDragEnter(event) {
    this.dragAreaClass = 'droparea';
    event.preventDefault();
  }

  @HostListener('dragend', ['$event']) onDragEnd(event) {
    this.dragAreaClass = 'dragarea';
    event.preventDefault();
  }

  @HostListener('dragleave', ['$event']) onDragLeave(event) {
    this.dragAreaClass = 'dragarea';
    event.preventDefault();
  }
  @HostListener('drop', ['$event']) onDrop(event) {
    this.dragAreaClass = 'dragarea';
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    this.saveFiles(files);
    // console.log(this.foldersdata);
    if (this.errors.length === 0) {
      this.imageDetail = Object.values(files);
      this.openDialog(this.imageDetail);
    }
  }

  saveFiles(files) {
    this.errors = [];
    // Validate file size and allowed extensions
    if (files.length > 0 && (!this.isValidFiles(files))) {
      this.uploadStatus.emit(false);
      return;
    }
    const fileSizeinMB = files[0].size / (1024 * 1000);
    const size = Math.round(fileSizeinMB * 100) / 100;
  }

  /* this is for checking for the maximum number of files */
  private isValidFiles(files) {
    // Check Number of files
    if (files.length > this.maxFiles) {
      this.alertService.warning('Error: At a time you can upload only ' + this.maxFiles + ' files');
      this.errors.push('Error: At a time you can upload only ' + this.maxFiles + ' files');
      return;
    }
    this.isValidFileExtension(files);
  }

  private isValidFileExtension(files) {
    // Make array of file extensions
    const extensions = (this.fileExt.split(','))
      .map(function (x) { return x.toLocaleUpperCase().trim(); });

    for (let i = 0; i < files.length; i++) {
      // Get file extension
      const ext = files[i].name.toUpperCase().split('.').pop() || files[i].name;
      // Check the extension exists
      const exists = extensions.includes(ext);
      if (!exists) {
        this.alertService.warning('Error (Extension): ' + files[i].name);
        this.errors.push('Error (Extension): ' + files[i].name);
        return;
      }
      // Check file size
      this.isValidFileSize(files[i]);
    }
  }

  /* this is for checking valid size of the file */
  private isValidFileSize(file) {
    const fileSizeinMB = file.size / (1024 * 1000);
    const size = Math.round(fileSizeinMB * 100) / 100; // convert upto 2 decimal place
    if (size > this.maxSize) {

      this.alertService.warning('Error (File Size): ' + file.name + ': exceed file size limit of '
        + this.maxSize + 'MB ( ' + size + 'MB )');
      this.errors.push('Error (File Size): ' + file.name + ': exceed file size limit of '
        + this.maxSize + 'MB ( ' + size + 'MB )');
    }
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
      this.getMediaGalleryData();
      this.getAlbumGallery();
    });
  }

  // this function used to upload the image or multiple images
  onUploadImages() {
    this.spinnerService.show();

    this.uploadImagesObject.client_id = AppConstants.CLIENT_ID;
    this.httpClient.post<ICommonInterface>(AppConstants.API_URL + 'flujo_client_postmedia', this.uploadImagesObject).subscribe(
      res => {
        if ((!res.error) && (res.custom_status_code === 100)) {
          this.uploadImagesObject = <IUploadImages>{};
          console.log(res.result);
          this.successMessagebool = true;
          this.spinnerService.hide();

          this.successMessagebool = true;
          this.alertService.success('Images uploaded successfully');
          this.getMediaGalleryData();
        } else if ((res.error) && (res.custom_status_code === 101)) {
          this.alertService.warning('Required parameters are missing');
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

      .get<ICommonInterface>(AppConstants.API_URL + 'flujo_client_getmedia/' + AppConstants.CLIENT_ID)
      .subscribe(
      data => {
        if (data.custom_status_code === 100) {
          this.mediaData = data.result;
          this.displayableMediaData = this.mediaData;
          this.spinnerService.hide();
        }
      },

      err => {
        this.spinnerService.hide();
      }
      );
  }
  deleteMediaImage(image_id) {
    this.spinnerService.show();
    this.httpClient.delete<ICommonInterface>(AppConstants.API_URL + 'flujo_client_deletemedia/' + image_id)
      .subscribe(
      data => {
        this.spinnerService.hide();
        if (!data.error && data.custom_status_code === 100) {
          this.hightlightStatus = [false];
          this.alertService.success('Image deleted Successfully');
          this.getMediaGalleryData();
        } else if (data.error && data.custom_status_code === 101) {
          this.alertService.warning('Required parameters are missing');
        } else if (data.error && data.custom_status_code === 124) {
          this.alertService.warning('Failed to delete, Image is used for Album');
        }
      },
      error => {
        this.spinnerService.hide();
        console.log(error);
      });

  }

  // this functon is used for getting the image id to insert into the group of album
  getImageId(item_id: IGalleryObject) {
    let item_index = null;
    _.some(this.albumObject.images, (albumItem, index) => {
      if (albumItem.media_id === item_id.id) {
        item_index = index;
      }
    });
    if (item_index === 0 || item_index > 0) {
      // this.albumObject.images = _.without(this.albumObject.images, item_index);
      this.albumObject.images.splice(item_index, 1);
    } else {
      this.albumImage = <IGalleryImageItem>{};
      this.albumImage.media_id = item_id.id;
      this.albumImage.title = null;
      this.albumImage.description = null;
      this.albumObject.images.push(this.albumImage);
    }
    this.albumImagesArraySize = _.size(this.albumObject.images);
  }

  // to create new album with title form from the html
  CreateNewAlbumForm(albumTitle: any) {
    let albumId = null;
    let albumItemData = null;
    console.log(this.createAlbumController.value);
    const isAlbumExisting = _.some(this.albumGallery, (albumItem) => {
        if (albumItem.title === this.createAlbumController.value) {
          albumId = albumItem.id;
          albumItemData = albumItem;
        }
        return albumItem.title === this.createAlbumController.value;
    });
    if (isAlbumExisting) {
      this.updateAlbumWithExistingImages(albumItemData, this.albumObject);
    } else {
      this.albumObject.client_id = AppConstants.CLIENT_ID;
      this.albumObject.title = this.createAlbumController.value;
      if (this.albumObject.title != null && this.albumImagesArraySize >= 2) {
        this.isAlbumObjectsPresentAlert = true;
        this.CreateNewAlbumHttpRequest(this.albumObject);
      } else {
        this.isAlbumObjectsPresentAlert = false;
      }
    }

  }
  // UPDATE ALBUM WITH EXITING IMAGES WITH ALBUM ID
  updateAlbumWithExistingImages = (albumItem, media) => {
    const mediaImageIds = [];
    _.each(media.images, (mediaItem) => {
      mediaImageIds.push(mediaItem.media_id);
    });
    const updateObject = {
      client_id: AppConstants.CLIENT_ID,
      album_id: albumItem.id,
      images: [...albumItem.images, ...media.images],
      media_ids: mediaImageIds
    };
    this.httpClient.post<ICommonInterface>(AppConstants.API_URL + 'flujo_client_addingmediaimagestoalbum', updateObject).subscribe(
      data => {
        this.spinnerService.hide();
        if (!data.error && data.custom_status_code === 100) {
          this.getAlbumGallery();
          this.spinnerService.hide();
          this.alertService.success('Album updated successfully.');
        } else if (data.error && data.custom_status_code === 101) {
          this.spinnerService.hide();
          this.alertService.danger('Something went wrong.please try again.');
        }
      },
      (err: HttpErrorResponse) => {
        this.spinnerService.hide();
        this.alertService.warning('Something went wrong.');
      }
    );
  }
  // http call for create a new gallery or update the exsiting gallery
  CreateNewAlbumHttpRequest(reqData) {
    this.spinnerService.show();

    this.httpClient.post<ICommonInterface>(AppConstants.API_URL + 'flujo_client_postalbum', reqData)
      .subscribe(
      data => {
        this.parseAlbumGalleryData = null;
        this.spinnerService.hide();
        if (!data.error && data.custom_status_code === 100) {
          this.albumCreateoptions.push(reqData.title);
          this.resetsubmitAlbumData();
          this.spinnerService.hide();
          this.getAlbumGallery();
          // this.parseReloadAlbumGalleryObject(data.result);

          this.hightlightStatus = [false];
          this.alertService.success('Album created successfully.');
        } else if (data.error && data.custom_status_code === 101) {
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
    this.createAlbumController.reset();
    this.albumObject = <IGalleryObject>{};
    this.albumObject.images = [];
    this.albumImagesArraySize = 0;
    this.albumCreateoptions = [];
  }


  getAlbumGallery() {
    this.spinnerService.show();
    this.httpClient
      .get<ICommonInterface>(AppConstants.API_URL + 'flujo_client_getalbum/' + AppConstants.CLIENT_ID)
      .subscribe(
      data => {
        if (!data.error && data.custom_status_code === 100) {
          this.albumCreateoptions = [];
          if (data.result.length > 0) {
            data.result.map(item => {
              if (item.images && item.images.length > 0) {
                item.images = JSON.parse(item.images);
              }
            });
            this.albumGallery = data.result;
            this.albumGallery.map((item: IGalleryObject) => {
              this.albumCreateoptions.push(item.title);
            });
            this.prepareAllAlbumImageIdsArray(data.result);
          }
          this.spinnerService.hide();
        } else if (data.error && data.custom_status_code === 101) {
          this.alertService.danger('Required parameters are missing.');
        }
      },

      err => {
        this.spinnerService.hide();
      }
      );
  }
  // parsing the AlbumGallery object for getting the album ids.
  prepareAlbumGalleryIdsObject(albumItems) {

    // this.parseAlbumGalleryData = JSON.parse(albumItems);
    this.parseAlbumGalleryData = albumItems;

    const albumGalleryIDsArry = [];
    _.each(this.parseAlbumGalleryData, (item) => {

      albumGalleryIDsArry.push(item.media_id);

    });
    return albumGalleryIDsArry;
  }
  // getting album gallery images by album id
  getAlbumGalleryImagesByIds(albumImageIds, albumid) {

    if (albumImageIds.length > 0) {
      this.spinnerService.show();
      this.httpClient.post<ICommonInterface>(AppConstants.API_URL + 'flujo_client_postmediaintoalbum', albumImageIds)
        .subscribe(
        data => {
          if (!data.error && data.custom_status_code === 100) {
            this.albumGalleryItem = data.result;
            this.spinnerService.hide();
          } else if (data.error && data.custom_status_code === 101) {
            this.alertService.warning('Required parameters are missing');
          }
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
        return num.media_id === albumItem.id;
      });
      console.log(filteredimagesArray);
      const popupData = this.prepareAlbumBase64ImagesObject(filteredimagesArray, albumItem);
      console.log(popupData[0].images);
      const dialogRef = this.dialog.open(EditGalleryItems, {
        data: popupData,
        height: '400px',
        width: '600px'
      });

      dialogRef.afterClosed().subscribe(result => {
        const singleMediaObject = <IAlbumImageUpdate>{};
        // prepare POST request object for updating the particular album details
        if (result) {
          singleMediaObject.description = result.description;
          singleMediaObject.order = result.order;
          singleMediaObject.title = result.title;
          singleMediaObject.media_id = result.id;
          console.log(this.parseAlbumGalleryData);
          // tslint:disable-next-line:no-shadowed-variable
          const filteredimagesArray = _.filter(this.parseAlbumGalleryData, (num) => {
            return num.media_id !== result.media_id;
          });
          console.log(filteredimagesArray);
          console.log(filteredimagesArray);
          this.albumObject = <IGalleryObject>{};
          this.albumObject.images = [];
          this.albumObject.album_id = this.originalAlbumData.id;
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

      if (albumdetals[item_index].media_id === base64images.id) {
        this.albumBase64imagesObject = {
          media_id: albumdetals[item_index].media_id,
          title: albumdetals[item_index].title, description: albumdetals[item_index].description,
          order: albumdetals[item_index].order, images: base64images.images
        };
        this.albumBase64imagesArray.push(this.albumBase64imagesObject);
      }

    });

    return this.albumBase64imagesArray;

  }
  tabChanged(tabItem) {
    // this.isViewUsedUnUsedImages = false;
    this.tabindex = tabItem.index;
    console.log(this.albumGallery);
    this.originalAlbumData = this.albumGallery[tabItem.index - 1];
    if (tabItem.index !== 0) {
      const firstAlbumData = this.prepareAlbumGalleryIdsObject(this.albumGallery[tabItem.index - 1].images);
      console.log(firstAlbumData);
      this.getAlbumGalleryImagesByIds(firstAlbumData, this.albumGallery[tabItem.index - 1].album_id);
    } else {
      this.getMediaGalleryData();
    }
  }
  // call from html ------  delete function to delete the album single image details.........
  deleteGalleryItem(albumItem) {

    const dialogRef = this.dialog.open(MediaDeletePopup, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        if (albumItem) {
          console.log(this.parseAlbumGalleryData);
          const filteredimagesArray = _.filter(this.parseAlbumGalleryData, (num) => {
            return Number(num.media_id) !== albumItem.id;
          });
          console.log(filteredimagesArray);
          this.albumObject = <IGalleryObject>{};
          this.albumObject.images = [];
          this.albumObject.album_id = this.originalAlbumData.id;
          this.albumObject.title = this.originalAlbumData.title;
          this.albumObject.client_id = this.originalAlbumData.client_id;

          _.each(filteredimagesArray, (item) => {
            this.albumObject.images.push(item);
          });
          // tslint:disable-next-line:no-shadowed-variable
          const result = this.deleteAlbumImage(this.albumObject, albumItem);

        }
      }

    });
  }

  deleteAlbum = (albumItem) => {
    console.log(albumItem);
    const images = [];
    _.each(albumItem.images, (imageItem) => {
      images.push(imageItem.media_id);
    });
    this.spinnerService.show();
    const deleteObject = {
      'client_id': AppConstants.CLIENT_ID,
      'album_id': albumItem.id,
      'media_id': images,
    };
    this.httpClient.post<ICommonInterface>(AppConstants.API_URL + 'flujo_client_deletealbum', deleteObject)
      .subscribe(
      data => {
        this.spinnerService.hide();
        if (!data.error && data.custom_status_code === 100) {
          this.hightlightStatus = [false];
          this.alertService.success('Album deleted Successfully');
          this.albumGallery = [];
          this.createAlbumController.reset();
          this.getMediaGalleryData();
          this.getAlbumGallery();
        } else if (data.error && data.custom_status_code === 101) {
          this.alertService.warning('Required parameters are missing');
        } else if (data.error && data.custom_status_code === 124) {
          this.alertService.warning('Failed to delete Album');
        }
      },
      error => {
        this.spinnerService.hide();
        console.log(error);
      });
  }
  deleteAlbumImage(albumObject: IGalleryObject, albumItem) {
    const mediaIsUsedIds = JSON.parse(albumItem.is_used);
    const filterIsUsedIds = _.filter(mediaIsUsedIds, (ids) => {
      return Number(ids) !== albumObject.album_id;
    });
    this.spinnerService.show();
    const deleteObject = {
      'client_id': AppConstants.CLIENT_ID,
      'album_id': albumObject.album_id,
      'images': albumObject.images,
      'media_id': albumItem.id,
      'is_used':  JSON.stringify(filterIsUsedIds)
    };
    this.httpClient.post<ICommonInterface>(AppConstants.API_URL + 'flujo_client_deleteimagefromalbum', deleteObject)
      .subscribe(
      data => {
        this.spinnerService.hide();
        if (!data.error && data.custom_status_code === 100) {
          this.hightlightStatus = [false];
          this.alertService.success('Image deleted Successfully');
          this.albumGallery = [];
          this.getMediaGalleryData();
          this.getAlbumGallery();
        } else if (data.error && data.custom_status_code === 101) {
          this.alertService.warning('Required parameters are missing');
        } else if (data.error && data.custom_status_code === 124) {
          this.alertService.warning('Failed to delete, Image is used for Abum');
        }
      },
      error => {
        this.spinnerService.hide();
        console.log(error);
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
    this.httpClient.get<IGalleryObject>(AppConstants.API_URL + 'flujo_client_getalbumbyid' + this.originalAlbumData.id)
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
    this.allAlbumImageIdsArray = [];
    _.each(data, (iteratee, index) => {
      const preparedImgsArray = this.prepareAlbumGalleryIdsObject(data[index].images);
      _.each(preparedImgsArray, (item) => {
        this.allAlbumImageIdsArray.push(item);
      });
    });
  }
  UsedImages = (tag) => {

    switch (tag) {
      case 'all': {
        this.displayableMediaData = this.mediaData;
        break;
      }
      case 'used': {
        this.displayableMediaData = _.filter(this.mediaData, (mediaItem: MediaDetail) => {
          return mediaItem.is_used.length > 1;
        });
        break;
      }
      case 'unused': {
        this.displayableMediaData = _.filter(this.mediaData, (mediaItem: MediaDetail) => {

          return mediaItem.is_used.length === 0 || mediaItem.is_used === null || mediaItem.is_used === undefined;
        });
        break;
      }
    }
  }

  uploadFile() {
    this.toggleFileUploader = !this.toggleFileUploader;
  }

}
