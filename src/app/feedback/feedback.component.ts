import { Component, OnInit, ElementRef, ViewChild, Input, Output, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ValidationService } from '../service/validation.service';
import { AlertModule, AlertService } from 'ngx-alerts';
import CSVExportService from 'json2csvexporter';
import { AppConstants } from '../app.constants';
import { IUserFeedback, IUserChangemaker } from '../model/feedback.model';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatSort, MatPaginator, SortDirection } from '@angular/material';
import { AdminComponent } from '../admin/admin.component';
import * as _ from 'underscore';
import { AccessDataModelComponent } from '../model/useraccess.data.model';
import { ICommonInterface } from '../model/commonInterface.model';
import { EventEmitter } from 'events';
import { IActiveHeader } from '../model/active-header.model';
@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit, AfterViewInit {
  public ActiveHeader: IActiveHeader;
  filteredUserAccessData: any;
  userAccessLevelObject: any;
  // tslint:disable-next-line:no-input-rename
  @Input('matSortDirection')
  direction: SortDirection;
  componentName = 'feedback';
  displayedColumns = ['name', 'updated', 'email', 'phone', 'message'];
  isActive = true;
  selected: string;
  checked: boolean;
  reportCsvMail: FormGroup;
  changeMakerCsvMail: FormGroup;
  feedbackCsvMail: FormGroup;
  isFeedbackReport = true;
  isChangeReport = false;
  loading = false;
  isReportData = false;
  public feedbackData: any;
  changemakerData: any;
  elementData: Array<Element>;
  dataSource: MatTableDataSource<Element>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public reportProblemData: any;
  showEmailClickFeedback = false;
  showEmailClick = false;
  userAccessDataModel: AccessDataModelComponent;
  showEmailClickReport = false;
  feature_id = 7;
  EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
  constructor(private spinnerService: Ng4LoadingSpinnerService,
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private alertService: AlertService,
    public router: Router,
    public adminComponent: AdminComponent,
    private activatedRoute: ActivatedRoute,
    private route: ActivatedRoute
  ) {
    this.feedbackCsvMail = this.formBuilder.group({
      'email': ['', Validators.compose([Validators.required, Validators.pattern(this.EMAIL_REGEXP)])],
      'client_id': [null]
    });
    if (Number(localStorage.getItem('feature_id')) !== this.feature_id) {
      this.userAccessDataModel = new AccessDataModelComponent(httpClient, router);
      this.userAccessDataModel.setUserAccessLevels(null, this.feature_id, 'admin/feedback');
    }

    this.ActiveHeader = {
      feedback: true,
      change_maker: false,
      surveys: false,
      database: false
    };
  }
  ngOnInit() {
    setTimeout(function () {
      this.spinnerService.hide();
    }.bind(this), 3000);
    this.getuserFeedbackData();
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  showFeedback() {
    this.isFeedbackReport = true;
    this.isReportData = false;
    this.isChangeReport = false;
  }
  getuserFeedbackData() {
    this.spinnerService.show();
    this.activatedRoute.data
      .subscribe(
        data => {
          if (data.feedbackReportData.result) {
            this.feedbackData = data.feedbackReportData.result;
            this.elementData = this.feedbackData;
            this.spinnerService.hide();
            this.dataSource = new MatTableDataSource(this.elementData);
          }
        },
        error => {
          // console.log(error);
        });
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  exportFeedbackData() {
    const csvColumnsList = ['id', 'name', 'email', 'phone', 'message', 'datenow'];
    const csvColumnsMap = {
      id: 'S.no',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      message: 'Message',
      datenow: 'Submited At'
    };
    const Data = [
      {
        id: this.feedbackData.id, name: this.feedbackData.name, email: this.feedbackData.email, phone: this.feedbackData.phone,
        message: this.feedbackData.message, datenow: this.feedbackData.datenow
      },
    ];
    const exporter = CSVExportService.create({
      columns: csvColumnsList,
      headers: csvColumnsMap,
      includeHeaders: true,
    });
    exporter.downloadCSV(this.feedbackData);
  }

  feedbackEmail() {
    this.showEmailClickFeedback = !this.showEmailClickFeedback;
  }
  feedbackCsvMailSubmit = (body) => {
    this.spinnerService.show();
    this.feedbackCsvMail.controls['client_id'].setValue(AppConstants.CLIENT_ID);
    const formModel = this.feedbackCsvMail.value;
    this.httpClient.post<ICommonInterface>(AppConstants.API_URL + '/flujo_client_feedbackdatacsvemail', formModel)
      .subscribe(
        data => {
            if (!data.error && (data.custom_status_code = 100)) {
              this.alertService.info('Attachement sent succesfully');
              this.feedbackCsvMail.reset();
              this.spinnerService.hide();
            } else if (data.error && (data.custom_status_code = 101)) {
              this.alertService.info('Required parameters are missing');
              this.spinnerService.hide();
            }
        },
        error => {
          this.spinnerService.hide();
        });
  }
  /* change directive when clicked*/
  radioChange = (name) => {

    this.componentName = name;
    this.isActive = !this.isActive;
    // this.router.navigate(['/admin/' + name]);
  }
}
