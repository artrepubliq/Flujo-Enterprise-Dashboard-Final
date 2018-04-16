import { Component, OnInit } from '@angular/core';
import { IUpdateableData, IAreaType } from '../model/area.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.scss']
})
export class AreasComponent implements OnInit {
  isEdit: boolean;
  feature_id = 25;
  actionText: string;
  filteredUserAccessData: any;
  userAccessLevelObject: any;
  selectArea: boolean;
  isNew: boolean;
  isCancel: boolean;
  areaId: string;
  areaTypeNameNew: string;
  areaPincodeNew: string;
  areaTeluguName: string;
  areaTelugu: string;
  areaName: string;
  areaPincode: string;
  newAreaData: IUpdateableData;
  areaData: Array<IAreaType>;
  areaForm: FormGroup;
  config: any;
  userAccessDataModel: AccessDataModelComponent;
  constructor(
    private httpService: HttpService,
    private areaService: AreaService,
    public loader: NgxSmartLoaderService,
    private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertService,
    public adminComponent: AdminComponent,
    private router: Router,
    private httpClient: HttpClient
  ) {
    this.areaPincode = '';
    this.areaName = '';
    this.areaTeluguName = '';
    this.areaTelugu = '';
    this.actionText = 'Add New +';
    this.isEdit = false;
    this.areaForm = new FormGroup({
      'areatypenamenew': new FormControl(this.areaTypeNameNew, [Validators.required]),
      'areateluguname': new FormControl(this.areaTeluguName, [Validators.required]),
      'areapincodenew': new FormControl(this.areaPincodeNew, [Validators.required, Validators.minLength(3), Validators.maxLength(6)]),
      'areaid': new FormControl(this.areaId),
    });
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

  public updateAreaData(area): void {
    console.log(area);
    this.isEdit = true;
    this.actionText = 'Update';
    this.areaName = area.area;
    this.areaId = area.id;
    this.areaPincode = area.pincode;
    this.areaTelugu = area.area_telugu;
    this.areaForm.get('areatypenamenew').setValue(this.areaName);
    this.areaForm.get('areapincodenew').setValue(this.areaPincode);
    this.areaForm.get('areateluguname').setValue(this.areaTelugu);
    this.areaForm.get('areaid').setValue(area.id);
  }

  public backToSelect(): void {
    this.isEdit = false;
    this.areaId = '';
    this.areaName = '';
    this.areaTelugu = '';
    this.areaPincode = '';
    this.actionText = 'Add';
    this.areaForm.get('areatypenamenew').setValue('');
    this.areaForm.get('areateluguname').setValue('');
    this.areaForm.get('areapincodenew').setValue('');
    this.areaForm.get('areapincode').setValue('');
  }

  public createNewArea() {
    if (!this.areaForm.get('areatypenamenew').value ||
      !this.areaForm.get('areateluguname').value || !this.areaForm.get('areapincodenew').value) {
      return false;
    }
    console.log(this.areaForm.value);
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
    console.log(this.newAreaData);
    this.areaService.updateAreaType('flujo_client_postreportarea', this.newAreaData)
      .subscribe(
        data => {
          console.log(data);
          if (AppConstants.ACCESS_TOKEN === data.access_token) {
            if (data.custom_status_code === 100) {
              this.alertService.success('Area updated successfully');
            } else if (data.custom_status_code === 101) {
              this.alertService.warning('Required parameters are missing!');
            } else if (data.custom_status_code === 102) {
              this.alertService.warning('Every thing is upto date!');
            }
            this.getAreaData();
            this.areaForm.reset();
            this.spinnerService.hide();
            this.isEdit = false;
            this.actionText = 'Add';
          }
        },
        error => {
          this.spinnerService.hide();
          this.alertService.warning('Something went wrong');
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
            this.actionText = 'Add';
          }
        },
        error => {
          this.alertService.warning('Something went wrong.');
          console.log(error);
        }
      );
  }
}
