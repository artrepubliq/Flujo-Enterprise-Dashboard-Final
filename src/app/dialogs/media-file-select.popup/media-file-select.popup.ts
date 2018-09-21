import { Component, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AlertModule, AlertService } from 'ngx-alerts';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IGalleryObject } from '../../model/gallery.model';
import { AppConstants } from '../../app.constants';
import { ICommonInterface } from '../../model/commonInterface.model';
import * as _ from 'underscore';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-overview-example-file-dialog',
  templateUrl: 'media-file-select.popup.html',
  styleUrls: ['../../media/media.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class FileSelectPopup implements OnInit {

  isApply = false;
  image_base64: Array<any>;
  selectedOption: any;
  filteredStates: Observable<any[]>;
  albumdescription: string;
  config: any;
  sendData: any = {};
  public options: string[] = [];
  myControl = new FormControl();
  // options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  constructor(
    public dialogRef: MatDialogRef<FileSelectPopup>,
    @Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient, private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertService) {

    dialogRef.disableClose = true;
    if (this.data.images.length > 1) {
      this.isApply = true;
    }
    this.data.images.map(imageBase => {
      const reader = new FileReader();
      this.image_base64 = [];
      reader.readAsDataURL(imageBase);
      reader.onload = () => {
        this.image_base64.push(reader.result.split(',')[1]);
      };
    });
    try {
      this.data.options.map(item => {
        this.options.push(item.title);
      });
    } catch (err) {
      this.options = [];
    }
  }

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges
    .pipe(
    startWith(''),
    map(value => this._filter(value))
    );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  closeDialog() {
    this.dialogRef.close();
  }

  saveFiles() {
    let album_id = null;
    const isAvailable = _.some(this.data.options, (albumItem: IGalleryObject) => {
      if (albumItem.title === this.myControl.value) {
        album_id = albumItem.id;
        return albumItem.title === this.myControl.value;
      }
    });
    console.log(isAvailable);

    this.spinnerService.show();
    if (this.data.images.length > 1) {
      const formData = new FormData();
      this.data.images.map(file => {
        formData.append('images[]', file);
      });
      formData.append('title', this.myControl.value);
      formData.append('description', this.albumdescription);
      formData.append('client_id', AppConstants.CLIENT_ID);
      formData.append('album_id', album_id);
      this.http.post(AppConstants.API_URL + 'flujo_client_postalbummedia', formData).subscribe(
        res => {

          this.spinnerService.hide();
          this.alertService.success('Uploaded successfully');
          this.dialogRef.close();
          console.log(res);
        },
        (err: HttpErrorResponse) => {
          this.spinnerService.hide();
          this.alertService.warning('Something went wrong.');
        }
      );
    } else if (this.data.images.length === 1) {
      const singleData = new FormData();
      this.data.images.map(file => {
        singleData.append('images[]', file);
      });
      this.albumdescription = this.albumdescription ? this.albumdescription : '';
      singleData.append('description', this.albumdescription);
      singleData.append('client_id', AppConstants.CLIENT_ID);
      singleData.append('album_id', null);
      this.http.post<ICommonInterface>(AppConstants.API_URL + 'flujo_client_postmedia', singleData)
        .subscribe(
        data => {
          if (!data.error && data.custom_status_code === 100) {
            this.alertService.info('Image uploaded successfully');
            this.spinnerService.hide();
            this.dialogRef.close();
          } else if (data.error && data.custom_status_code === 101) {
            this.alertService.danger('Image not uploaded');
            this.spinnerService.hide();
            this.dialogRef.close();
          }
        }
        );
    }
  }

}
