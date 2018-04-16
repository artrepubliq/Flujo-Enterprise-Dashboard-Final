import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ValidationService } from '../service/validation.service';
import { AlertModule, AlertService } from 'ngx-alerts';
import CSVExportService from 'json2csvexporter';
import { AppConstants } from '../app.constants';
import { IUserFeedback, IUserChangemaker } from '../model/feedback.model';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {MatTableDataSource, MatSort, MatPaginator, SortDirection, Sort} from '@angular/material';
import { Element } from '../model/element-model';
import { Observable } from 'rxjs/Observable';
import { DataSource } from '@angular/cdk/collections';
import { AdminComponent } from '../admin/admin.component';
import { Router } from '@angular/router';
import * as _ from 'underscore';
import { CommonInterface } from '../model/analytics.model';
@Component({
  selector: 'app-changemaker',
  templateUrl: './changemaker.component.html',
  styleUrls: ['./changemaker.component.scss']
})

export class ChangemakerComponent implements OnInit {
  filteredUserAccessData: any;
  userAccessLevelObject: any;
  dataSource = new MatTableDataSource<Element>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  changeMakerElementData: Array<Element>;
  reportCsvMail: FormGroup;
  changeMakerCsvMail: FormGroup;
  feedbackCsvMail: FormGroup;
  isFeedbackReport = true;
  isChangeReport = false;
  loading = false;
  isReportData = false;
  public feedbackData: any;
  changemakerData: Array<Element>;
  changemakerData2: Array<Element>;
  public reportProblemData: any;
  showEmailClickFeedback = false;
  showEmailClick = false;
  showEmailClickReport = false;
  displayedColumns = ['name', 'updated', 'email', 'phone', 'message', 'source'];
  EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
  config: any;
  p: number;
  submitted: boolean;
  constructor(
    private spinnerService: Ng4LoadingSpinnerService,
    private formBuilder: FormBuilder, private httpClient:
    HttpClient, private alertService: AlertService, public adminComponent: AdminComponent, private router: Router) {

   this.feedbackCsvMail = this.formBuilder.group({
    'email': ['', Validators.compose([Validators.required, Validators.pattern(this.EMAIL_REGEXP)])],
   });
   this.changeMakerCsvMail = this.formBuilder.group({
    'email': ['', Validators.compose([Validators.required, Validators.pattern(this.EMAIL_REGEXP)])],
   });
   this.reportCsvMail = this.formBuilder.group({
    'email': ['', Validators.compose([Validators.required, Validators.pattern(this.EMAIL_REGEXP)])],
   });
    this.getChangemakerReportData();

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
      if (this.adminComponent.userAccessLevelData[iterate].name === 'Change Maker' && this.adminComponent.userAccessLevelData[iterate].enable) {
        this.filteredUserAccessData = item;
      } else {
      }
    });
    if (this.filteredUserAccessData) {
      this.router.navigate(['admin/changemakerreport']);
    } else {
      this.router.navigate(['/accessdenied']);
    }
  }

  getChangemakerReportData() {
    this.spinnerService.show();
    this.httpClient.get<CommonInterface>(AppConstants.API_URL + 'flujo_client_getchangemaker/' + AppConstants.CLIENT_ID)
      .subscribe(
      data => {
        if (data.error) {
          console.log('Something went wrong while fetching data');
        } else if ((data.error === false) && (data.access_token === AppConstants.ACCESS_TOKEN)) {
          console.log(data);
          this.changemakerData = data.result;
          this.changemakerData2 = data.result;
          this.dataSource = new MatTableDataSource(this.changemakerData);
        // this.changemakerData.paginator = this.paginator;
        this.changeMakerElementData = this.changemakerData;
        console.log(this.changemakerData);
        }
        this.spinnerService.hide();
      },
      error => {
        console.log(error);
      });
  }
  public applyFilter(filterValue: string): void {
    console.log(filterValue);
    console.log(this.changemakerData);
    this.changemakerData2 = this.changemakerData.filter((item) =>
      (item.name.includes(filterValue) ||
      (item.date_now.includes(filterValue)) ||
      (item.email.includes(filterValue))
    ));
  }
  sortData(sort: Sort) {
    const data = this.changeMakerElementData.slice();
    if (!sort.active || sort.direction === '') {
      this.changemakerData2 = data;
      return;
    }
    this.changemakerData2 = data.sort((a, b) => {
      const isAsc = sort.direction === 'desc';
      switch (sort.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'email': return compare(+a.email, +b.email, isAsc);
        case 'date_now': return compare(+a.date_now, +b.date_now, isAsc);
        default: return 0;
      }
    });
  }
  exportChangermakereport() {
    const csvColumnsList = ['id', 'name', 'email', 'phone', 'client_id', 'date_now'];
    const csvColumnsMap = {
      id: 'S.no',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      client_id: 'Client Id',
      date_now: 'Submited At'
    };
    const Data = [
      {
        id: this.changemakerData[0].id,
        name: this.changemakerData[0].name,
        email: this.changemakerData[0].email,
        phone: this.changemakerData[0].phone,
        date_now: this.changemakerData[0].date_now
      },
    ];
    const exporter = CSVExportService.create({
      columns: csvColumnsList,
      headers: csvColumnsMap,
      includeHeaders: true,
    });
    exporter.downloadCSV(this.changemakerData);
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
}
function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
