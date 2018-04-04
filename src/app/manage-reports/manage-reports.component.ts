import { Component, OnInit, Inject, AfterViewInit, ViewChild, OnDestroy  } from '@angular/core';
import * as _ from 'underscore';
import { AppConstants } from '../app.constants';
import { HttpClient } from '@angular/common/http';
import { ICreateUserDetails } from '../model/createUser.model';
import { IArrows } from '../model/arrows.model';

import CSVExportService from 'json2csvexporter';
import {MatTableDataSource, MatSort, MatPaginator, SortDirection, Sort} from '@angular/material';
import { FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { IPostAssignedUser, IPostReportStatus } from '../model/reports-management.model';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AlertService } from 'ngx-alerts';
import { IshowReports } from '../model/showRepots.model';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Router } from '@angular/router';
import { AdminComponent } from '../admin/admin.component';
@Component({
    templateUrl: './manage-reports.component.html',
    styleUrls: ['./manage-reports.component.scss']

})

export class ManageReportsComponent implements OnInit, AfterViewInit, OnDestroy {
    filteredUserAccessData: any;
    userAccessLevelObject: any;
    showReports: IshowReports;
    assignedReportId: any;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    reportProblemData: any;
    reportProblemData2: any;
    filterReportProblemData: any;
    // loggedinUsersList: Array<ICreateUserDetails>;
    loggedinUsersList: Array<any>;
    postAssignedUsersObject: IPostAssignedUser;
    postMoveToRemarksObject: IPostReportStatus;
    // postAssignedUserArray = [];
    usersListControl: FormControl = new FormControl();
    moveToListControl: FormControl = new FormControl();
    remarksListControl: FormControl = new FormControl();
    reportAssignedToUserName: string;
    reportMoveToOption: string;
    reportRemarksOption: string;
    reportCsvMail: FormGroup;
    usersListOptions = [];
    moveToListOptions = ['In Progress', 'Completed', 'Pending/UnResolved'];
    RemarksListOptions = ['constituency', 'othersOne', 'otherstwo', 'othersthree'];
    filteredusersListOptions: Observable<string[]>;
    filteredMoveToListOptions: Observable<string[]>;
    FilteredRemarksListOptions: Observable<string[]>;
    searchReport: any;
    config: any;
    arrows: IArrows;
    picker: any;
    p: number;

    private filterSubject: Subject<string> = new Subject<string>();
    constructor(public httpClient: HttpClient,
        private spinnerService: Ng4LoadingSpinnerService,
        private alertService: AlertService, private router: Router, public adminComponent: AdminComponent
    ) {
        this.arrows = <IArrows>{};
        this.arrows.age_arrow = false;
        this.arrows.area_arrow = false;
        this.arrows.gender_arrow = false;
        this.arrows.name_arrow = false;
        this.arrows.submitted_at_arrow = false;

        this.showReports = <IshowReports>{};
        this.showReports.completedActive = false;
        this.showReports.inProgressActive = false;
        this.filterSubject.debounceTime(300).distinctUntilChanged().subscribe( searchItem =>
        this.onChange2(searchItem));
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
        this.spinnerService.show();
        this.prepareMoveToAutoCompleteOptionsList(this.moveToListOptions);
        this.prepareRemarksAutoCompleteOptionsList(this.RemarksListOptions);

        this.getUserList()
            .subscribe(
                data => {
                    this.loggedinUsersList = data;
                    this.prepareAutoCompleteOptionsList(this.loggedinUsersList);
                },
                error => {
                    console.log(error);
                }
            );

        this.getAllReports();
    }
    ngAfterViewInit() {
        this.spinnerService.hide();
    }
    // this for restrict user on root access level
  userRestrict() {
    _.each(this.adminComponent.userAccessLevelData, (item, iterate) => {
      // tslint:disable-next-line:max-line-length
      if (this.adminComponent.userAccessLevelData[iterate].name === 'Report an issue' && this.adminComponent.userAccessLevelData[iterate].enable) {
        this.filteredUserAccessData = item;
      } else {

      }
    });
    if (this.filteredUserAccessData) {
      this.router.navigate(['admin/managereports']);
    }else {
      this.router.navigate(['/accessdenied']);
    }
  }
    // prepare auto complete options list
    prepareAutoCompleteOptionsList = (listData) => {
        if (listData) {
            _.each(listData, (iteratee) => {
                this.usersListOptions.push(iteratee.name);
            });
            try {
                this.filteredusersListOptions = this.usersListControl.valueChanges.pipe(
                    startWith(''),
                    map(val => this.usersListOptions.filter(option => option.toLowerCase().indexOf(val.toLowerCase()) === 0))
                );
            } catch (error) {
                console.log(error);
            }
        }
    }
    // Moveto options filter callbak
    prepareMoveToAutoCompleteOptionsList = (optionsList) => {
        try {
            this.filteredMoveToListOptions = this.moveToListControl.valueChanges.pipe(
                startWith(''),
                map(val => optionsList.filter(option => option.toLowerCase().indexOf(val.toLowerCase()) === 0))
            );
        } catch (error) {
            console.log(error);
        }
    }
    // Moveto options filter callbak
    prepareRemarksAutoCompleteOptionsList = (optionsList) => {
        try {
            this.FilteredRemarksListOptions = this.remarksListControl.valueChanges.pipe(
                startWith(''),
                map(val => optionsList.filter(option => option.toLowerCase().indexOf(val.toLowerCase()) === 0))
            );
        } catch (error) {
            console.log(error);
        }
    }
    AssignedUserName = (user, reportId) => {
        this.reportAssignedToUserName = user;
        this.assignedReportId = reportId;
        this.prepareAutoCompleteOptionsList(this.loggedinUsersList);
    }
    // this function is used for getting remarks option
    getRemarksOption = (remarksoption) => {
        // this.assignedReportId = reportId;
        this.reportRemarksOption = remarksoption;
        this.prepareRemarksAutoCompleteOptionsList(this.RemarksListOptions);
    }
    // this function is used for getting Move to options data
    getMoveToOptions = (moveoption) => {
        // this.assignedReportId = reportId;
        this.reportMoveToOption = moveoption;
        this.prepareMoveToAutoCompleteOptionsList(this.moveToListOptions);
    }
    // this finction is  for to store the assigned user in database by calling http service
    updateAssignedUserIntoDB() {
        this.spinnerService.show();
        this.postAssignedUsersObject = <IPostAssignedUser>{};
        this.postAssignedUsersObject.assigned_user_name = this.reportAssignedToUserName;
        this.postAssignedUsersObject.client_id = AppConstants.CLIENT_ID;
        this.postAssignedUsersObject.report_issue_id = this.assignedReportId;
        // this.postAssignedUsersObject.email_to_send = localStorage.getItem('email');
        _.some(this.loggedinUsersList, (user, index) => {
            const result = user.name === this.reportAssignedToUserName;
            if (result) {
                this.postAssignedUsersObject.email_to_send = this.loggedinUsersList[index].email;
            }
        });
        this.httpClient.post<Object>(AppConstants.API_URL + 'flujo_client_postreportassigned', this.postAssignedUsersObject)
            .subscribe(
                resp => {
                    this.alertService.success('Your request updated successfully.');
                    this.spinnerService.hide();
                    this.usersListControl = new FormControl();
                },
                error => {
                    this.alertService.danger('Somthing went wrong. please try again.');
                    this.spinnerService.hide();
                    console.log(error);
                }
            );
    }
    // this function is used for updating the reports remarks and moveto status and by whoom its update.
    UpdateReportsStatus = (report) => {
        this.spinnerService.show();
        if (localStorage.getItem('user_id')) {
            this.postMoveToRemarksObject = <IPostReportStatus>{};
            this.postMoveToRemarksObject.report_id = report.id;
            this.postMoveToRemarksObject.report_remarks = this.reportRemarksOption;
            this.postMoveToRemarksObject.report_status = this.reportMoveToOption;
            this.postMoveToRemarksObject.updated_by = localStorage.getItem('user_id');
            this.postMoveToRemarksObject.email_to_send = report.email;
            this.postMoveToRemarksObject.send_reportstatus_phone = report.phone;
            this.postMoveToRemarksObject.description = report.problem;
            this.httpClient.post<Object>(AppConstants.API_URL + 'flujo_client_updatereportproblem', this.postMoveToRemarksObject)
                .subscribe(
                    resp => {
                        this.alertService.success('Your request updated successfully.');
                        this.spinnerService.hide();
                        this.moveToListControl = new FormControl();
                        this.remarksListControl = new FormControl();
                    },
                    error => {
                        this.alertService.danger('Somthing went wrong. please try again.');
                        this.spinnerService.hide();
                        console.log(error);
                    }
                );
        }
    }
    // clear all fields of UpdateReportsStatus
    clearUpdateReportsStatusFields() {
        this.postMoveToRemarksObject = null;
        this.postMoveToRemarksObject.report_id = null;
        this.postMoveToRemarksObject.report_remarks = null;
        this.postMoveToRemarksObject.report_status = null;
        this.postMoveToRemarksObject.updated_by = null;
    }
    // this function is used for getting reports data from the server
    getAllReports = () => {
        this.httpClient.get(AppConstants.API_URL + 'flujo_client_getreportproblem/' + AppConstants.CLIENT_ID)
            .subscribe(
                data => {
                    this.reportProblemData = data;
                    this.reportProblemData2 = data;
                    this.filterReportProblemData = data;
                    // console.log(data);
                },
                error => {
                    console.log(error);
                }
            );
    }
    // this function is used for getting all the users from the database
    getUserList = () => {
        // tslint:disable-next-line:max-line-length
        return this.httpClient.get<Array<ICreateUserDetails>>(AppConstants.API_URL + 'flujo_client_getcreateuser/' + AppConstants.CLIENT_ID);
    }

    exportManageReports() {
        const csvColumnsList = ['name', 'submitted_at', 'email', 'phone', 'gender', 'age', 'area'];
        const csvColumnsMap = {
            name: 'Name',
            submitted_at: 'Submitted on',
            email: 'Email',
            phone: 'Phone number',
            gender: 'Gender',
            age: 'Age',
            area: 'Area'
        };
        const Data = [
            {
                name: this.reportProblemData.name,
                submitted_at: this.reportProblemData.submitted_at,
                email: this.reportProblemData.email,
                phone: this.reportProblemData.phone,
                gender: this.reportProblemData.gender,
                age: this.reportProblemData.age,
                area: this.reportProblemData.area
            },
        ];
        const exporter = CSVExportService.create({
            columns: csvColumnsList,
            headers: csvColumnsMap,
            includeHeaders: true,
        });
        exporter.downloadCSV(this.reportProblemData);
    }

    /* this is to sort table rows */
    sortArray = (table_cell, arrow) => {

        if (this.arrows[arrow] === false) {
            this.filterReportProblemData = _.sortBy(this.filterReportProblemData, table_cell).reverse();
            this.arrows[arrow] = true;
        } else {
            this.filterReportProblemData = _.sortBy(this.filterReportProblemData, table_cell);
            this.arrows[arrow] = false;
        }
    }
    sortByStatus = (reportStatus) => {
        if (reportStatus === '0') {
            this.showReports.completedActive = true;
            this.showReports.inProgressActive = false;
        }
        if (reportStatus === '1') {
            this.showReports.completedActive = false;
            this.showReports.inProgressActive = true;
        }

        this.filterReportProblemData = this.reportProblemData;
        this.filterReportProblemData = this.reportProblemData.filter(reportData => reportData.report_status === reportStatus);

    }

    public onChange2(searchTerm: string): void {
        this.filterReportProblemData = this.reportProblemData.filter((item) =>
                (item.name.includes(searchTerm) ||
                (item.age.includes(searchTerm)) ||
                (item.submitted_at.includes(searchTerm)) ||
                (item.phone.includes(searchTerm)) ||
                (item.email.includes(searchTerm)) ||
                (item.gender.includes(searchTerm)) ||
                (item.area.includes(searchTerm))
        ));
    }

    public onChange(searchitem: string): void {
        this.filterSubject.next(searchitem);
    }


    public ngOnDestroy(): void {
        this.filterSubject.complete();
    }
}
