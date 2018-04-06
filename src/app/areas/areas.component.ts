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
  isEdit: boolean;
  actionText: string;
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
  newAreaData: IUpdateableData;
  areaData: Array<IAreaType>;
  areaForm: FormGroup;
  config: any;
  constructor(
    private httpService: HttpService,
    private areaService: AreaService,
    public loader: NgxSmartLoaderService,
    private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertService,
    public adminComponent: AdminComponent,
    private router: Router
  ) {
    this.areaPincode = '';
    this.areaName = '';
    this.actionText = 'Add New +';
    this.isEdit = false;
    this.areaForm = new FormGroup({
      'areatypenamenew': new FormControl(this.areaTypeNameNew, [Validators.required]),
      'areapincodenew': new FormControl(this.areaPincodeNew, [Validators.required, Validators.minLength(3), Validators.maxLength(6)]),
      'areaid': new FormControl(this.areaId),
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
    if (this.filteredUserAccessData) {
      this.router.navigate(['admin/area']);
    }else {
      this.router.navigate(['/accessdenied']);
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

  public updateAreaData(area): void {
    console.log(area);
    this.isEdit = true;
    this.actionText = 'Update';
    this.areaName = area.area;
    this.areaId = area.id;
    this.areaPincode = area.pincode;
    this.areaForm.get('areatypenamenew').setValue(this.areaName);
    this.areaForm.get('areapincodenew').setValue(this.areaPincode);
    this.areaForm.get('areaid').setValue(area.id);
  }

  public backToSelect(): void {
    this.isEdit = false;
    this.areaId = '';
    this.areaName = '';
    this.areaPincode = '';
    this.actionText = 'Add';
    this.areaForm.get('areatypenamenew').setValue('');
    this.areaForm.get('areapincodenew').setValue('');
    this.areaForm.get('areapincode').setValue('');
  }

  public createNewArea() {
    if (!this.areaForm.get('areatypenamenew').value || !this.areaForm.get('areapincodenew').value) {
      return false;
    }
    console.log(this.areaForm.value);
    this.spinnerService.show();
    if (this.areaForm.get('areaid').value) {
      this.newAreaData = {
        client_id: AppConstants.CLIENT_ID,
        area: this.areaForm.get('areatypenamenew').value,
        pincode: this.areaForm.get('areapincodenew').value,
        reportarea_id: this.areaForm.get('areaid').value
      };
    } else {
      this.newAreaData = {
        client_id: AppConstants.CLIENT_ID,
        area: this.areaForm.get('areatypenamenew').value,
        pincode: this.areaForm.get('areapincodenew').value,
      };
    }
    console.log(this.newAreaData);
    this.areaService.updateAreaType('flujo_client_postreportarea', this.newAreaData)
      .subscribe(
        data => {
          console.log(data);
          if (data.error) {
            this.alertService.warning(data.result);
          } else {
            this.alertService.success('Area Updated Successfully');
          }
          this.getAreaData();
          this.areaForm.reset();
          this.spinnerService.hide();
          this.isEdit = false;
          this.actionText = 'Add';
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
          this.spinnerService.hide();
          this.alertService.success('Area deleted successfully');
          this.getAreaData();
          this.areaForm.reset();
          this.isEdit = false;
          this.actionText = 'Add';
        },
        error => {
          this.alertService.success('File something went wrong successfully');
          console.log(error);
        }
      );
  }
}
