import { Component, OnInit, Inject } from '@angular/core';
import { HttpService } from '../service/httpClient.service';
import { AppConstants } from '../app.constants';
import { IproblemType, IUpdateableData } from '../model/problemType.model';
import { ProblemTypeService } from '../service/problem-type.service';
import { IHttpResponse } from '../model/httpresponse.model';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { NgxSmartLoaderService } from 'ngx-smart-loader';
import { AlertService } from 'ngx-alerts';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AdminComponent } from '../admin/admin.component';
import { Router } from '@angular/router';
import * as _ from 'underscore';
import { AccessDataModelComponent } from '../model/useraccess.data.model';
import { HttpClient } from '@angular/common/http';
import { ICommonInterface } from '../model/commonInterface.model';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
@Component({
  selector: 'app-problem-category',
  templateUrl: './problem-category.component.html',
  styleUrls: ['./problem-category.component.scss']
})
export class ProblemCategoryComponent implements OnInit {
  checked: false;
  isEdit: boolean;
  add: any;
  filteredUserAccessData: any;
  userAccessLevelObject: any;
  selectProblem: boolean;
  problemId: string;
  problemTypeNameNew: string;
  problemTypeNameTeluguNew: string;
  problemTypeNameTelugu: string;
  problemTypeName: string;
  updatableData: IUpdateableData;
  newProblemData: IUpdateableData;
  problemTypeData: any;
  updateProblem: boolean;
  problemForm: FormGroup;
  actionText: string;
  config: any;
  feature_id = 24;
  userAccessDataModel: AccessDataModelComponent;
  constructor(
    private httpService: HttpService,
    private problemService: ProblemTypeService,
    public loader: NgxSmartLoaderService,
    private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertService,
    public adminComponent: AdminComponent,
    private router: Router,
    private httpClient: HttpClient,
    public dialog: MatDialog
  ) {
    this.updateProblem = false;
    this.selectProblem = true;
    this.actionText = 'Add New +';
    this.problemId = '';
    this.isEdit = false;
    this.problemTypeNameNew = '';
    this.problemTypeNameTeluguNew = '';
    this.problemForm = new FormGroup({
      'problemid': new FormControl(this.problemId),
      'problemtypenamenew': new FormControl(this.problemTypeNameNew, [Validators.required]),
      'problemtypenametelugunew': new FormControl(this.problemTypeNameTeluguNew, [Validators.required])
    });

    if (Number(localStorage.getItem('feature_id')) !== this.feature_id) {
      this.userAccessDataModel = new AccessDataModelComponent(httpClient, router);
      this.userAccessDataModel.setUserAccessLevels(null, this.feature_id, 'admin/problemcategory');
    }
  }

  ngOnInit() {
    this.getproblemData();
  }

  public getproblemData(): void {
    this.spinnerService.show();
    this.problemService.getProblemData('/flujo_client_getreportproblemtype/', AppConstants.CLIENT_ID)
      .subscribe(
        data => {
          if (data.custom_status_code === 100 && data.result.length > 0) {
            this.problemTypeData = data.result;
          } else if (data.custom_status_code === 101) {
            this.alertService.warning('Required parameters are missing!');
          }
          this.spinnerService.hide();
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
    this.problemTypeNameTeluguNew = problem.problem_type_telugu;
    this.problemId = problem.id;
    this.problemForm.get('problemtypenamenew').setValue(this.problemTypeNameNew);
    this.problemForm.get('problemtypenametelugunew').setValue(this.problemTypeNameTeluguNew);
    this.problemForm.get('problemid').setValue(this.problemId);
    console.log(this.problemForm.value);
  }
  public deleteProblem(problem): void {
    console.log(problem);
    this.spinnerService.show();
    this.problemService.deleteProblem('flujo_client_deletereportproblemtype/', problem.id)
      .subscribe(
        data => {
          if (AppConstants.ACCESS_TOKEN === data.access_token) {
            if (data.custom_status_code === 100) {
              this.alertService.success('Problem deleted successfully');
            } else if (data.custom_status_code === 101) {
              this.alertService.warning('Required parameters are missing!');
            }
          }
          this.spinnerService.hide();
          this.getproblemData();
          this.problemForm.reset();
          this.isEdit = false;
        },
        error => {
          this.alertService.warning('something went wrong');
          console.log(error);
        }
      );
  }

  selectAll() {
    for (let i = 0; i < this.problemTypeData.length; i++) {
      this.problemTypeData[i].selected = this.checked;
    }
  }
  /*Pop up for is for add and update of area data*/
  openDialog(problem): void {
    console.log(problem);
    if (problem) {
      const dialogRef = this.dialog.open(ProblemCategoryEditPopup, {
        width: '30vw',
        data: problem,
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.getproblemData();
      });
    } else if (!problem) {
      const dialogRef = this.dialog.open(ProblemCategoryEditPopup, {
        width: '30vw',
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.getproblemData();
      });
    }
  }
}
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'problem-popup-dialog-example.html',
  styleUrls: ['./problem-category.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class ProblemCategoryEditPopup {
  problemId: any;
  problemTypeNameTeluguNew: any;
  problemTypeNameNew: any;
  areaTelugu: any;
  areaPincode: any;
  areaId: any;
  areaName: any;
  actionText = 'Save';
  newProblemData: IUpdateableData;
  reportData: any;
  problemForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<ProblemCategoryEditPopup>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private spinnerService: Ng4LoadingSpinnerService,
    private httpClient: HttpClient,
    private alertService: AlertService) {
    this.problemForm = this.formBuilder.group({
      'problemtypenamenew': ['', ],
      'problemtypenametelugunew': ['', ],
      'problemid': [null],
      'client_id': [null]
    });
    if (this.data) {
      console.log(this.data.area);
      this.reportData = this.data;
      this.updateProblemData(this.reportData);
    }
    dialogRef.disableClose = true;
  }
  postAreaData = () => {
    if (!this.problemForm.get('problemtypenamenew').value) {
      return false;
    }
    console.log(this.problemForm.value);
    if (this.problemForm.get('problemid').value) {
      this.newProblemData = {
        client_id: AppConstants.CLIENT_ID,
        problem_type: this.problemForm.get('problemtypenamenew').value,
        problem_type_telugu: this.problemForm.get('problemtypenametelugunew').value,
        reportproblemtype_id: this.problemForm.get('problemid').value,
      };
    } else {
      this.newProblemData = {
        client_id: AppConstants.CLIENT_ID,
        problem_type: this.problemForm.get('problemtypenamenew').value,
        problem_type_telugu: this.problemForm.get('problemtypenametelugunew').value
      };
    }
    console.log(this.problemForm.get('problemtypenamenew').value);
    this.newProblemData.created_by = localStorage.getItem('name');
    console.log(this.newProblemData);
    this.spinnerService.show();
    this.httpClient.post<ICommonInterface>(AppConstants.API_URL + 'flujo_client_postreportproblemtype', this.newProblemData)
      .subscribe(
        data => {
          if (AppConstants.ACCESS_TOKEN === data.access_token) {
            if (data.custom_status_code === 100) {
              this.alertService.success('Problem updated successfully');
              this.dialogRef.close();
            } else if (data.custom_status_code === 101) {
              this.alertService.warning('Required parameters are missing!');
            } else if (data.custom_status_code === 102) {
              this.alertService.warning('Every thing is upto date!');
            }
          }
          console.log(data);
          this.spinnerService.hide();
          this.problemForm.reset();
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
    this.problemForm.reset();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public updateProblemData(problem): void {
    console.log(problem);
    this.actionText = 'Update';
    this.problemTypeNameNew = problem.problem_type;
    this.problemTypeNameTeluguNew = problem.problem_type_telugu;
    this.problemId = problem.id;
    this.problemForm.get('problemtypenamenew').setValue(this.problemTypeNameNew);
    this.problemForm.get('problemtypenametelugunew').setValue(this.problemTypeNameTeluguNew);
    this.problemForm.get('problemid').setValue(this.problemId);
    console.log(this.problemForm.value);
  }
}
