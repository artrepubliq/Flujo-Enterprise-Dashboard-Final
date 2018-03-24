import { Component, OnInit } from '@angular/core';
import { HttpService } from '../service/httpClient.service';
import { AppConstants } from '../app.constants';
import { IproblemType, IUpdateableData } from '../model/problemType.model';
import { ProblemTypeService } from '../service/problem-type.service';
import { IHttpResponse } from '../model/httpresponse.model';
import { FormGroup, FormControl } from '@angular/forms';

import { NgxSmartLoaderService } from 'ngx-smart-loader';
import { AlertService } from 'ngx-alerts';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-problem-category',
  templateUrl: './problem-category.component.html',
  styleUrls: ['./problem-category.component.scss']
})
export class ProblemCategoryComponent implements OnInit {
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
    private alertService: AlertService
  ) {
    this.updateProblem = false;
    this.isEdit = false;
    this.newProblemBtn = true;
    this.selectProblem = true;
    this.isCancel = false;
    this.problemForm = new FormGroup({
      'problemtypename': new FormControl(this.problemTypeName),
      'problemtypenamenew': new FormControl(this.problemTypeNameNew)
    });
  }

  ngOnInit() {
    this.getproblemData();
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
    this.spinnerService.show();
    this.updatableData.client_id = AppConstants.CLIENT_ID;
    this.updatableData.problem_type = this.problemForm.get('problemtypename').value;
    console.log(this.updatableData);
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
    // this.spinnerService.show();
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
