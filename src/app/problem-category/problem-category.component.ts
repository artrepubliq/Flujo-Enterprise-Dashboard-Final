import { Component, OnInit } from '@angular/core';
import { HttpService } from '../service/httpClient.service';
import { AppConstants } from '../app.constants';
import { IproblemType, IUpdateableData } from '../model/problemType.model';
import { ProblemTypeService } from '../service/problem-type.service';
import { IHttpResponse } from '../model/httpresponse.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { NgxSmartLoaderService } from 'ngx-smart-loader';
import { AlertService } from 'ngx-alerts';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AdminComponent } from '../admin/admin.component';
import { Router } from '@angular/router';
import * as _ from 'underscore';
@Component({
  selector: 'app-problem-category',
  templateUrl: './problem-category.component.html',
  styleUrls: ['./problem-category.component.scss']
})
export class ProblemCategoryComponent implements OnInit {
  filteredUserAccessData: any;
  userAccessLevelObject: any;
  selectProblem: boolean;
  isNew: boolean;
  isCancel: boolean;
  problemId: string;
  problemTypeNameNew: string;
  problemTypeName: string;
  updatableData: IUpdateableData;
  newProblemData: IUpdateableData;
  problemTypeData: Array<IproblemType>;
  updateProblem: boolean;
  newProblemBtn: boolean;
  isEdit: boolean;
  problemForm: FormGroup;
  constructor(
    private httpService: HttpService,
    private problemService: ProblemTypeService,
    public loader: NgxSmartLoaderService,
    private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertService,
    public adminComponent: AdminComponent,
    private router: Router
  ) {
    this.updateProblem = false;
    this.isEdit = false;
    this.newProblemBtn = true;
    this.selectProblem = true;
    this.isCancel = false;
    this.problemForm = new FormGroup({
      'problemtypename': new FormControl(this.problemTypeName),
      'problemtypenamenew': new FormControl(this.problemTypeNameNew, [Validators.required])
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
    this.getproblemData();
  }
  // this for restrict user on root access level
  userRestrict() {
    _.each(this.adminComponent.userAccessLevelData, (item, iterate) => {
      // tslint:disable-next-line:max-line-length
      if (this.adminComponent.userAccessLevelData[iterate].name === 'Problem Category' && this.adminComponent.userAccessLevelData[iterate].enable) {
        this.filteredUserAccessData = item;
      } else {
        // this.router.navigate(['/accessdenied']);
        // console.log('else');
      }
    });
    if (this.filteredUserAccessData) {
      this.router.navigate(['/problemcategory']);
    }else {
      this.router.navigate(['/accessdenied']);
      console.log('else');
    }
  }
  public getproblemData(): void {
    this.spinnerService.show();
    this.problemService.getProblemData('/flujo_client_getreportproblemtype/', AppConstants.CLIENT_ID)
      .subscribe(
        data => {
          this.spinnerService.hide();
          this.problemTypeData = data;
          console.log(this.problemTypeData);
        },
        error => {
          console.log(error);
        }
      );
  }
  /* this is for on change problem select */
  public onChangetProblem(event: IUpdateableData): void {
    if (event) {
      console.log(event);
      this.updateProblem = true;
      this.updatableData = event;
      console.log(this.updateProblem);
    } else {
      this.updateProblem = false;
      console.log(this.updateProblem);
    }
  }

  public updateProblemData(): void {
    if (this.updatableData) {
      this.isEdit = true;
      this.selectProblem = false;
      this.updateProblem = false;
      this.newProblemBtn = false;
      this.isCancel = true;
      this.problemTypeName = this.updatableData.problem_type;
      this.problemId = this.updatableData.reportproblemtype_id;
      // console.log(this.updatableData);
    }
  }

  public backToSelect(): void {
    // this.problemTypeName = '';
    this.isEdit = false;
    this.newProblemBtn = true;
    this.isNew = false;
    this.isCancel = false;
    this.selectProblem = true;
  }

  public updateProblemService(): void {
    this.updatableData.client_id = AppConstants.CLIENT_ID;
    this.updatableData.problem_type = this.problemForm.get('problemtypename').value;
    console.log(this.updatableData);
    if (this.updatableData.problem_type) {
      this.spinnerService.show();
      this.problemService.updateProblemType('flujo_client_postreportproblemtype', this.updatableData)
        .subscribe(
          data => {
            console.log(data);
            this.spinnerService.hide();
            this.alertService.success('Problem Updated Successfully');
            this.getproblemData();
          },
          error => {
            this.spinnerService.hide();
            this.alertService.warning('Something went wrong');
            console.log(error);
          }
        );
    } else {
      this.alertService.warning('Please fill in the Problem field');
    }
  }

  public createNewBtn(): void {
    // this.isEdit = false;
    this.selectProblem = false;
    this.isNew = true;
    this.isCancel = true;
    this.newProblemBtn = false;
    this.updateProblem = false;

  }
  public createNewproblem() {
    if (!this.problemForm.get('problemtypenamenew').value) {
      return false;
    }
    this.newProblemData = {
      client_id: AppConstants.CLIENT_ID,
      problem_type: this.problemForm.get('problemtypenamenew').value
    };
    console.log(this.problemForm.get('problemtypenamenew').value);
    console.log(this.newProblemData);
    this.spinnerService.show();
    this.problemService.updateProblemType('flujo_client_postreportproblemtype', this.newProblemData)
      .subscribe(
        data => {
          console.log(data);
          this.spinnerService.hide();
          this.alertService.success('Problem Updated Successfully');
          this.getproblemData();
        },
        error => {
          this.spinnerService.hide();
          this.alertService.warning('Something went wrong');
          console.log(error);
        }
      );
  }

  public deleteProblem(): void {
    this.spinnerService.show();
    // this.updatableData.client_id = AppConstants.CLIENT_ID;
    // this.updatableData.problem_type = this.problemForm.get('problemtypename').value;
    console.log(this.updatableData.reportproblemtype_id);
    this.problemService.deleteProblem('flujo_client_deletereportproblemtype/', this.updatableData.reportproblemtype_id)
      .subscribe(
        data => {
          this.spinnerService.hide();
          this.alertService.success('Problem deleted successfully');
          this.getproblemData();
        },
        error => {
          this.alertService.success('File something went wrong successfully');
          console.log(error);
        }
      );
  }
}
