import { Component, OnInit, Inject, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import * as _ from 'underscore';
import { AppConstants } from '../app.constants';
import { HttpClient } from '@angular/common/http';
import { ICreateUserDetails } from '../model/createUser.model';
import { IArrows } from '../model/arrows.model';
import CSVExportService from 'json2csvexporter';
import { MatTableDataSource, MatSort, MatPaginator, SortDirection, Sort } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { Router, ActivatedRoute } from '@angular/router';
import { AdminComponent } from '../admin/admin.component';
import { ICommonInterface } from '../model/commonInterface.model';
@Component({
    templateUrl: './manage-reports.component.html',
    styleUrls: ['./manage-reports.component.scss']

})

export class ManageReportsComponent implements OnInit, AfterViewInit, OnDestroy {
    checked: false;
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
    moveToListOptions = ['Completed', 'In Progress', 'Pending/UnResolved'];
    RemarksListOptions = ['constituency', 'othersOne', 'otherstwo', 'othersthree'];
    filteredusersListOptions: Observable<string[]>;
    filteredMoveToListOptions: Observable<string[]>;
    FilteredRemarksListOptions: Observable<string[]>;
    searchReport: any;
    config: any;
    arrows: IArrows;
    picker: any;
    p: number;
    feature_id = 5;
    private filterSubject: Subject<string> = new Subject<string>();
    constructor(public httpClient: HttpClient,
        private spinnerService: Ng4LoadingSpinnerService,
        private alertService: AlertService, private router: Router, public adminComponent: AdminComponent,
        private activatedRoute: ActivatedRoute, private route: ActivatedRoute,
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
        this.filterSubject.debounceTime(300).distinctUntilChanged().subscribe(searchItem =>
            this.onChange2(searchItem));
        this.filterReportProblemData = [];
    }
    ngOnInit() {
        this.spinnerService.show();
        this.getAllReports();
        this.prepareMoveToAutoCompleteOptionsList(this.moveToListOptions);
        this.prepareRemarksAutoCompleteOptionsList(this.RemarksListOptions);
        this.spinnerService.show();

        this.getUserList()
            .subscribe(
                data => {
                    this.loggedinUsersList = data.result;
                    this.prepareAutoCompleteOptionsList(this.loggedinUsersList);
                    this.spinnerService.hide();
                },
                error => {
                    // console.log(error);
                    this.spinnerService.hide();
                }
            );

    }
    ngAfterViewInit() {
        this.spinnerService.hide();
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
                // console.log(error);
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
            // console.log(error);
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
            // console.log(error);
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
                // console.log(this.postAssignedUsersObject.email_to_send);
            }
        });
        // console.log(this.postAssignedUsersObject);
        this.httpClient.post<ICommonInterface>(AppConstants.API_URL + 'flujo_client_postreportassigned', this.postAssignedUsersObject)
            .subscribe(
                resp => {
                    // console.log(resp);
                    if (!resp.error) {
                        this.alertService.success('Your request updated successfully.');
                        this.spinnerService.hide();
                        this.usersListControl = new FormControl();
                    } else if (resp.custom_status_code === 101) {
                        this.alertService.danger('Required parameters are missing');
                        this.spinnerService.hide();
                    } else {
                        this.spinnerService.hide();
                        this.alertService.danger('Somthing went wrong.');
                        // console.log('something went wrong');
                    }
                },
                error => {
                    this.alertService.danger('Somthing went wrong. please try again.');
                    this.spinnerService.hide();
                    // console.log(error);
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
            this.postMoveToRemarksObject.description = report.report_description; // report.problem
            // console.log(this.postMoveToRemarksObject);
            this.httpClient.post<ICommonInterface>(AppConstants.API_URL + 'flujo_client_updatereportproblem', this.postMoveToRemarksObject)
                .subscribe(
                    resp => {
                        // console.log(resp);
                        if (!resp.error) {
                            this.alertService.success('Your request updated successfully.');
                            this.spinnerService.hide();
                            this.moveToListControl = new FormControl();
                            this.remarksListControl = new FormControl();
                        } else if (resp.custom_status_code === 101) {
                            this.alertService.danger('Required parameters are missing');
                            this.spinnerService.hide();
                        } else {
                            this.spinnerService.hide();
                            this.alertService.danger('Somthing went wrong.');
                            // console.log('something went wrong');
                        }
                    },
                    error => {
                        this.alertService.danger('Somthing went wrong. please try again.');
                        this.spinnerService.hide();
                        // console.log(error);
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
        this.postMoveToRemarksObject.description = null;
    }
    // this function is used for getting reports data from the server
    getAllReports = (): void => {
        this.spinnerService.show();
        this.activatedRoute.data.subscribe(data => {
            console.log(data);
                    if (!data.reportData.error) {
                        this.reportProblemData = data.reportData.result;
                        this.reportProblemData2 = data.reportData.result;
                        this.filterReportProblemData = data.reportData.result;
                        this.spinnerService.hide();
                    } else {
                        this.spinnerService.hide();
                        // console.log('something went wrong');
                    }
                },
                error => {
                    this.spinnerService.hide();
                    // console.log(error);
                }
            );
    }
    // this function is used for getting all the users from the database
    getUserList = () => {
        // tslint:disable-next-line:max-line-length
        return this.httpClient.get<ICommonInterface>(AppConstants.API_URL + 'flujo_client_getcreateuser/' + AppConstants.CLIENT_ID);
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
    selectAll() {
        for (let i = 0; i < this.filterReportProblemData.length; i++) {
            this.filterReportProblemData[i].selected = this.checked;
        }
    }
}
