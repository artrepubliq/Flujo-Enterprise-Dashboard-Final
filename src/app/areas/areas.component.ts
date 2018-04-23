import { Component, OnInit, Inject } from '@angular/core';
import { IUpdateableData, IAreaType } from '../model/area.model';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { HttpService } from '../service/httpClient.service';
import { AreaService } from '../service/area.service';
import { NgxSmartLoaderService } from 'ngx-smart-loader';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AlertService } from 'ngx-alerts';
import { AppConstants } from '../app.constants';
import * as _ from 'underscore';
import { AdminComponent } from '../admin/admin.component';
import { Router } from '@angular/router';
import { AccessDataModelComponent } from '../model/useraccess.data.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ICommonInterface } from '../model/commonInterface.model';
@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.scss']
})
export class AreasComponent implements OnInit {
  isEdit: boolean;
  feature_id = 25;
  filteredUserAccessData: any;
  add: any;
  userAccessLevelObject: any;
  newAreaData: IUpdateableData;
  areaData: Array<IAreaType>;
  areaForm: FormGroup;
  config: any;
  actionText = 'Add New +';
  userAccessDataModel: AccessDataModelComponent;
  constructor(
    private httpService: HttpService,
    private areaService: AreaService,
    public loader: NgxSmartLoaderService,
    private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertService,
    public adminComponent: AdminComponent,
    private router: Router,
    private httpClient: HttpClient,
    public dialog: MatDialog
  ) {
    if (Number(localStorage.getItem('feature_id')) !== this.feature_id) {
      this.userAccessDataModel = new AccessDataModelComponent(httpClient, router);
      this.userAccessDataModel.setUserAccessLevels(null, this.feature_id, 'admin/areacategory');
    }
  }

  ngOnInit() {
    this.getAreaData();
  }
  public getAreaData(): void {
    this.spinnerService.show();
    this.areaService.getAreaData('/flujo_client_getreportarea/', AppConstants.CLIENT_ID)
      .subscribe(
        data => {
          if (AppConstants.ACCESS_TOKEN === data.access_token) {
            if (data.custom_status_code === 100 && data.result.length > 0) {
              this.areaData = data.result;
            } else if (data.custom_status_code === 101) {
              this.alertService.warning('Required parameters are missing!');
            }
            this.spinnerService.hide();
            // this.areaData = data;
            console.log(this.areaData);
          }
        },
        error => {
          this.spinnerService.hide();
          console.log(error);
        }
      );
  }
  public deletearea(area): void {
    this.spinnerService.show();
    console.log(area);
    this.areaService.deleteArea('flujo_client_deletereportarea/', area.id)
      .subscribe(
        data => {
          if (AppConstants.ACCESS_TOKEN === data.access_token) {
            if (data.custom_status_code === 100) {
              this.alertService.success('Area deleted successfully');
            } else if (data.custom_status_code === 101) {
              this.alertService.warning('Required parameters are missing!');
            }
            this.spinnerService.hide();
            this.getAreaData();
            this.areaForm.reset();
            this.isEdit = false;
          }
        },
        error => {
          this.alertService.warning('Something went wrong.');
          console.log(error);
        }
      );
  }
  /*Pop up for is for add and update of area data*/
  openDialog(area): void {
    console.log(area);
    if (area) {
      const dialogRef = this.dialog.open(AreaEditPopup, {
        width: '30vw',
        data: area,
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.getAreaData();
      });
    } else if (!area) {
      const dialogRef = this.dialog.open(AreaEditPopup, {
        width: '30vw',
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.getAreaData();
      });
    }
  }
}
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'area-popup-dialog-example.html',
  styleUrls: ['./areas.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class AreaEditPopup {
  areaTelugu: any;
  areaPincode: any;
  areaId: any;
  areaName: any;
  actionText = 'Save';
  newAreaData: IUpdateableData;
  test: any;
  areaForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AreaEditPopup>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private spinnerService: Ng4LoadingSpinnerService,
    private httpClient: HttpClient,
    private alertService: AlertService) {
    this.areaForm = this.formBuilder.group({
      'areatypenamenew': ['', ],
      'areateluguname': ['', ],
      'areapincodenew': ['', ],
      'areaid': [null],
      'client_id': [null]
    });
    if (this.data) {
      console.log(this.data.area);
      this.test = this.data;
      this.updateAreaData(this.test);
    }
  }
  postAreaData = () => {
    if (!this.areaForm.get('areatypenamenew').value ||
      !this.areaForm.get('areateluguname').value || !this.areaForm.get('areapincodenew').value) {
      return false;
    }
    this.spinnerService.show();
    if (this.areaForm.get('areaid').value) {
      this.newAreaData = {
        client_id: AppConstants.CLIENT_ID,
        area: this.areaForm.get('areatypenamenew').value,
        area_telugu: this.areaForm.get('areateluguname').value,
        pincode: this.areaForm.get('areapincodenew').value,
        reportarea_id: this.areaForm.get('areaid').value
      };
    } else {
      this.newAreaData = {
        client_id: AppConstants.CLIENT_ID,
        area: this.areaForm.get('areatypenamenew').value,
        area_telugu: this.areaForm.get('areateluguname').value,
        pincode: this.areaForm.get('areapincodenew').value,
      };
    }
    this.httpClient.post<ICommonInterface>(AppConstants.API_URL + 'flujo_client_postreportarea', this.newAreaData)
      .subscribe(
        data => {
          if (AppConstants.ACCESS_TOKEN === data.access_token) {
            if (data.custom_status_code === 100) {
              this.alertService.success('Area updated successfully');
              this.dialogRef.close();
            } else if (data.custom_status_code === 101) {
              this.alertService.warning('Required parameters are missing!');
            } else if (data.custom_status_code === 102) {
              this.alertService.warning('Every thing is upto date!');
            }
            this.areaForm.reset();
            this.spinnerService.hide();
          }
        },
        error => {
          this.spinnerService.hide();
          this.alertService.warning('Something went wrong');
          console.log(error);
        }
      );
  }
  cancelPostAreaData () {
    this.dialogRef.close();
    this.areaForm.reset();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  updateAreaData(area): void {
    this.actionText = 'Update';
    this.areaName = this.test.area;
    this.areaId = this.test.id;
    this.areaPincode = this.test.pincode;
    this.areaTelugu = this.test.area_telugu;
    this.areaForm.get('areatypenamenew').setValue(this.areaName);
    this.areaForm.get('areapincodenew').setValue(this.areaPincode);
    this.areaForm.get('areateluguname').setValue(this.areaTelugu);
    this.areaForm.get('areaid').setValue(area.id);
  }

}
