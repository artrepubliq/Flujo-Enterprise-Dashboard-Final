import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ValidationService } from '../service/validation.service';
import { AlertModule, AlertService } from 'ngx-alerts';
import CSVExportService from 'json2csvexporter';
import { AppConstants } from '../app.constants';
import { IUserFeedback, IUserChangemaker } from '../model/feedback.model';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Router } from '@angular/router';
import {MatTableDataSource, MatSort, MatPaginator, SortDirection} from '@angular/material';
import { AdminComponent } from '../admin/admin.component';
import * as _ from 'underscore';
@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  filteredUserAccessData: any;
  userAccessLevelObject: any;
  // tslint:disable-next-line:no-input-rename
  @Input('matSortDirection')
  direction: SortDirection;
  componentName = 'feedback';
  displayedColumns = ['name', 'updated',  'email', 'phone', 'message', ];
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
  dataSource = new MatTableDataSource<Element>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public reportProblemData: any;
  showEmailClickFeedback = false;
  showEmailClick = false;
  showEmailClickReport = false;
  EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
  constructor(private spinnerService: Ng4LoadingSpinnerService,
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private alertService: AlertService,
    public router: Router,
    public adminComponent: AdminComponent
  ) {
   this.feedbackCsvMail = this.formBuilder.group({
    'email': ['', Validators.compose([Validators.required, Validators.pattern(this.EMAIL_REGEXP)])],
   });
   this.changeMakerCsvMail = this.formBuilder.group({
    'email': ['', Validators.compose([Validators.required, Validators.pattern(this.EMAIL_REGEXP)])],
   });
   this.reportCsvMail = this.formBuilder.group({
    'email': ['', Validators.compose([Validators.required, Validators.pattern(this.EMAIL_REGEXP)])],
   });
    this.getuserFeedbackData();

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
              } else {
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
    setTimeout(function () {
      this.spinnerService.hide();
    }.bind(this), 3000);
  }

  userRestrict() {
    _.each(this.adminComponent.userAccessLevelData, (item, iterate) => {
      // tslint:disable-next-line:max-line-length
      if (this.adminComponent.userAccessLevelData[iterate].name === 'Feedback' && this.adminComponent.userAccessLevelData[iterate].enable) {
        this.filteredUserAccessData = item;
      } else {
      }
    });
    if (this.filteredUserAccessData) {
      this.router.navigate(['admin/feedback']);
    } else {
      this.router.navigate(['/accessdenied']);
    }
  }

  showFeedback() {
    this.isFeedbackReport = true;
    this.isReportData = false;
    this.isChangeReport = false;
  }
  showChangemaker() {
    this.isChangeReport = true;
    this.isFeedbackReport = false;
    this.isReportData = false;
  }
  showReportProblem() {
    this.isReportData = true;
    this.isChangeReport = false;
    this.isFeedbackReport = false;
    // this.getReportYourProblemData();
  }


  getuserFeedbackData() {
    this.spinnerService.show();
    this.httpClient.get(AppConstants.API_URL + 'flujo_client_getfeedback/' + AppConstants.CLIENT_ID)
      .subscribe(
      data => {
        this.feedbackData = data;
        this.elementData = this.feedbackData;
        this.spinnerService.hide();
        this.dataSource = new MatTableDataSource(this.elementData);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error => {
        console.log(error);
      });
    // this.http
    //   .get<IUser>('http://flujo.in/dashboard/flujo.in_ajay/public/feedback-report')
    //   .subscribe(
    //   // Successful responses call the first callback.
    //   data => {
    //     this.feedbackData = data;
    //     // console.log(this.itemData)
    //   },
    //   // Errors will call this callback instead:
    //   err => {
    //     // console.log('Something went wrong!');
    //   }
    //   );
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
  changereportemail() {
    this.showEmailClick = !this.showEmailClick;
  }
  exportReportProblemEmail() {
    this.showEmailClickReport = !this.showEmailClickReport;
  }
  feedbackCsvMailSubmit = (body) => {
    this.spinnerService.show();
    const formModel = this.feedbackCsvMail.value;

    this.httpClient.post(AppConstants.API_URL + 'flujo_client_feedbackreportmailattachment', formModel)
      .subscribe(
      data => {
        this.feedbackCsvMail.reset();
        this.alertService.info('Attachement sent succesfully');
        this.spinnerService.hide();
      },
      error => {
        this.spinnerService.hide();
        this.alertService.danger('Email could not sent');
      });
  }
  changeMakerCsvMailSubmit = (body) => {
    this.spinnerService.show();
    const formModel = this.changeMakerCsvMail.value;

    this.httpClient.post(AppConstants.API_URL + 'flujo_client_changemakerreportmailattachment', formModel)
      .subscribe(
      data => {
        this.changeMakerCsvMail.reset();
        this.alertService.info('Attachement sent succesfully');
        this.spinnerService.hide();
      },
      error => {
        this.spinnerService.hide();
        this.alertService.danger('Email could not sent');
      });
  }
  reportCsvMailSubmit = (body) => {
    this.spinnerService.show();
    const formModel = this.reportCsvMail.value;

    this.httpClient.post(AppConstants.API_URL + 'flujo_client_reportproblemreportmailattachment', formModel)
      .subscribe(
      data => {
        this.reportCsvMail.reset();
        this.alertService.info('Attachement sent succesfully');
        this.spinnerService.hide();
      },
      error => {
        this.spinnerService.hide();
        this.alertService.danger('Email could not sent');
      });
  }
  /* change directive when clicked*/
  radioChange = (name) => {
    console.log('hai');
    console.log(name);
    this.componentName = name;
    this.isActive = !this.isActive;
    // this.router.navigate(['/admin/' + name]);
  }
}
