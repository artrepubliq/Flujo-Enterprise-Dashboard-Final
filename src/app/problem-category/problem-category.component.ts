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
  isEdit: boolean;
  filteredUserAccessData: any;
  userAccessLevelObject: any;
  selectProblem: boolean;
  problemId: string;
  problemTypeNameNew: string;
  problemTypeName: string;
  updatableData: IUpdateableData;
  newProblemData: IUpdateableData;
  problemTypeData: Array<IproblemType>;
  updateProblem: boolean;
  problemForm: FormGroup;
  actionText: string;
  config: any;
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
    this.selectProblem = true;
    this.actionText = 'Add New +';
    this.problemId = '';
    this.isEdit = false;
    this.problemTypeNameNew = '';
    this.problemForm = new FormGroup({
      'problemid': new FormControl(this.problemId),
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
      this.router.navigate(['admin/problemcategory']);
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
          this.spinnerService.hide();
            this.alertService.warning('Something went wrong');
        }
      );
  }

  public updateProblemData(problem): void {
    console.log(problem);
    this.isEdit = true;
    this.actionText = 'Update';
    this.problemTypeNameNew = problem.problem_type;
    this.problemId = problem.id;
    this.problemForm.get('problemtypenamenew').setValue(this.problemTypeNameNew);
    this.problemForm.get('problemid').setValue(this.problemId);
    console.log(this.problemForm.value);
  }

  public backToSelect(): void {
    this.isEdit = false;
    this.actionText = 'Add';
    this.problemTypeNameNew = '';
    this.problemId = '';
    this.problemForm.get('problemtypenamenew').setValue('');
    this.problemForm.get('problemid').setValue('');
  }

  public createNewproblem() {
    if (!this.problemForm.get('problemtypenamenew').value) {
      return false;
    }
    console.log(this.problemForm.value);
    if (this.problemForm.get('problemid').value) {
      this.newProblemData = {
        client_id: AppConstants.CLIENT_ID,
        problem_type: this.problemForm.get('problemtypenamenew').value,
        reportproblemtype_id: this.problemForm.get('problemid').value,
      };
    } else {
      this.newProblemData = {
        client_id: AppConstants.CLIENT_ID,
        problem_type: this.problemForm.get('problemtypenamenew').value
      };
    }
    console.log(this.problemForm.get('problemtypenamenew').value);
    console.log(this.newProblemData);
    this.spinnerService.show();
    this.problemService.updateProblemType('flujo_client_postreportproblemtype', this.newProblemData)
      .subscribe(
        data => {
          if (data.error) {
            this.alertService.warning(data.result);
          } else {
            this.alertService.success('Problem Updated Successfully');
          }
          console.log(data);
          this.spinnerService.hide();
          this.getproblemData();
          this.problemForm.reset();
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

  public deleteProblem(problem): void {
    console.log(problem);
    this.spinnerService.show();
    this.problemService.deleteProblem('flujo_client_deletereportproblemtype/', problem.id)
      .subscribe(
        data => {
          this.spinnerService.hide();
          this.alertService.success('Problem deleted successfully');
          this.getproblemData();
          this.problemForm.reset();
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
