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
@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.scss']
})
export class AreasComponent implements OnInit {

  filteredUserAccessData: any;
  userAccessLevelObject: any;
  selectArea: boolean;
  isNew: boolean;
  isCancel: boolean;
  areaId: string;
  areaTypeNameNew: string;
  areaPincodeNew: string;
  areaName: string;
  areaPincode: string;
  updatableData: IUpdateableData;
  newAreaData: IUpdateableData;
  areaData: Array<IAreaType>;
  updateArea: boolean;
  newAreaBtn: boolean;
  isEdit: boolean;
  areaForm: FormGroup;
  constructor(
    private httpService: HttpService,
    private areaService: AreaService,
    public loader: NgxSmartLoaderService,
    private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertService,
    public adminComponent: AdminComponent,
    private router: Router
  ) {
    this.updateArea = false;
    this.isEdit = false;
    this.newAreaBtn = true;
    this.selectArea = true;
    this.isCancel = false;
    this.areaPincode = '';
    this.areaName = '';
    this.areaForm = new FormGroup({
      // 'areaname': new FormControl(this.areaName),
      // 'areapincode': new FormControl(this.areaPincode),
      'areatypenamenew': new FormControl(this.areaTypeNameNew, [Validators.required]),
      'areapincodenew': new FormControl(this.areaPincodeNew, [Validators.required]),
      'areaid': new FormControl(this.areaId),
    });
    if (this.adminComponent.userAccessLevelData) {
      console.log(this.adminComponent.userAccessLevelData[0].name);
      this.userRestrict();
    } else {
      this.adminComponent.getUserAccessLevelsHttpClient()
        .subscribe(
          resp => {
            console.log(resp);
            this.spinnerService.hide();
            _.each(resp, item => {
              if (item.user_id === localStorage.getItem('user_id')) {
                  this.userAccessLevelObject = item.access_levels;
              }else {
                // this.userAccessLevelObject = null;
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
    this.getAreaData();
  }
  // this for restrict user on root access level
userRestrict() {
  _.each(this.adminComponent.userAccessLevelData, (item, iterate) => {
    // tslint:disable-next-line:max-line-length
    if (this.adminComponent.userAccessLevelData[iterate].name === 'Area Category' && this.adminComponent.userAccessLevelData[iterate].enable) {
      this.filteredUserAccessData = item;
      } else {
        // this.router.navigate(['/accessdenied']);
        // console.log('else');
      }
    });
    if (this.filteredUserAccessData.name) {
      this.router.navigate(['/area']);
    }else {
      this.router.navigate(['/accessdenied']);
      console.log('else');
    }
}
  public getAreaData(): void {
    this.spinnerService.show();
    this.areaService.getAreaData('/flujo_client_getreportarea/', AppConstants.CLIENT_ID)
      .subscribe(
        data => {
          this.spinnerService.hide();
          this.areaData = data;
          console.log(this.areaData);
        },
        error => {
          console.log(error);
        }
      );
  }
  /* this is for on change Area select */
  public onChangeArea(event: IUpdateableData): void {
    if (event) {
      console.log(event);
      this.updateArea = true;
      this.updatableData = event;
      console.log(this.updateArea);
      this.areaPincode = this.updatableData.pincode;
    } else {
      this.updateArea = false;
      console.log(this.updateArea);
    }
  }

  public updateAreaData(area): void {
    console.log(area);
    // console.log(this.updatableData);
    // if (this.updatableData) {
      // this.isEdit = true;
      // this.selectArea = false;
      // this.updateArea = false;
      // this.newAreaBtn = false;
      // this.isCancel = true;
      this.areaName = area.area;
      this.areaId = area.id;
      this.areaPincode = area.pincode;
      this.areaForm.get('areaid').setValue(area.id);
      console.log(this.areaForm.get('areaid').value);
      // console.log(this.updatableData);
    // }
  }

  public backToSelect(): void {
    // this.areaName = '';
    this.isEdit = false;
    this.newAreaBtn = true;
    this.isNew = false;
    this.isCancel = false;
    this.selectArea = true;
    this.areaForm.get('areatypenamenew').setValue('');
    this.areaForm.get('areapincodenew').setValue('');
    this.areaForm.get('areapincode').setValue('');
  }

  public updateAreaService(): void {
    this.updatableData.client_id = AppConstants.CLIENT_ID;
    this.updatableData.area = this.areaForm.get('areaname').value;
    this.updatableData.pincode = this.areaForm.get('areapincode').value;
    console.log(this.areaForm.valid);
    console.log(this.updatableData);
    if ((this.updatableData.area !== '') && (this.updatableData.pincode !== '')) {
      this.spinnerService.show();
      this.areaService.updateAreaType('flujo_client_postreportarea', this.updatableData)
        .subscribe(
          data => {
            console.log(data);
            this.spinnerService.hide();
            this.alertService.success('Area Updated Successfully');
            this.getAreaData();
          },
          error => {
            this.spinnerService.hide();
            this.alertService.warning('Something went wrong');
            console.log(error);
          }
        );
    } else {
      this.alertService.warning('Please fill the input details');
    }
  }

  public createNewBtn(): void {
    // this.isEdit = false;
    this.selectArea = false;
    this.isNew = true;
    this.isCancel = true;
    this.newAreaBtn = false;
    this.updateArea = false;

  }
  public createNewArea() {
    if (!this.areaForm.get('areatypenamenew').value || !this.areaForm.get('areapincodenew').value) {
      return false;
    }
    this.spinnerService.show();
    this.newAreaData = {
      client_id: AppConstants.CLIENT_ID,
      area: this.areaForm.get('areatypenamenew').value,
      pincode: this.areaForm.get('areapincodenew').value
    };
    console.log(this.areaForm.get('areatypenamenew').value);
    console.log(this.newAreaData);
    this.areaService.updateAreaType('flujo_client_postreportarea', this.newAreaData)
      .subscribe(
        data => {
          console.log(data);
          this.spinnerService.hide();
          this.alertService.success('Area Updated Successfully');
          this.getAreaData();
        },
        error => {
          this.spinnerService.hide();
          this.alertService.warning('Something went wrong');
          console.log(error);
        }
      );
  }

  public deletearea(area): void {
    // this.updatableData.client_id = AppConstants.CLIENT_ID;
    // this.updatableData.Area_type = this.areaForm.get('areaname').value;
    // console.log(this.updatableData);
    // console.log(this.updatableData.reportarea_id);
    this.spinnerService.show();
    console.log(area);
    this.areaService.deleteArea('flujo_client_deletereportarea/', area.id)
      .subscribe(
        data => {
          this.spinnerService.hide();
          this.alertService.success('Area deleted successfully');
          this.getAreaData();
        },
        error => {
          this.alertService.success('File something went wrong successfully');
          console.log(error);
        }
      );
  }


}
