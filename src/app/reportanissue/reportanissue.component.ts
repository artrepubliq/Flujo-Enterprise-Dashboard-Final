import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ValidationService } from '../service/validation.service';
import { AlertModule, AlertService } from 'ngx-alerts';
import CSVExportService from 'json2csvexporter';
import { AppConstants } from '../app.constants';
import { IUserFeedback, IUserChangemaker } from '../model/feedback.model';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import {FormControl} from '@angular/forms';
import { AdminComponent } from '../admin/admin.component';
import { Router } from '@angular/router';
import * as _ from 'underscore';

@Component({
  selector: 'app-reportanissue',
  templateUrl: './reportanissue.component.html',
  styleUrls: ['./reportanissue.component.scss']
})
export class ReportanissueComponent implements OnInit {
  filteredUserAccessData: any;
  userAccessLevelObject: any;
  reportCsvMail: FormGroup;
  changeMakerCsvMail: FormGroup;
  feedbackCsvMail: FormGroup;
  isFeedbackReport = true;
  isChangeReport = false;
  loading = false;
  isReportData = false;
  public feedbackData: any;
  changemakerData: any;
  public reportProblemData: any;
  showEmailClickFeedback = false;
  showEmailClick = false;
  showEmailClickReport = false;
  EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
  submitted: boolean;
  
  constructor(private spinnerService: Ng4LoadingSpinnerService, private formBuilder: FormBuilder,
    private httpClient: HttpClient, private alertService: AlertService,
    private router: Router) {
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
    this.getuserFeedbackData();
    this.getReportYourProblemData();
  }

  myControl: FormControl = new FormControl();
  filter(val: string): string[] {
    return this.options.filter(option =>
      option.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  ngOnInit() {
    setTimeout(function () {
      this.spinnerService.hide();
    }.bind(this), 3000);

    this.filteredOptions = this.myControl.valueChanges
    .pipe(
      startWith(''),
      map(val => this.filter(val))
    );
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
  getChangemakerReportData() {
    this.spinnerService.show();
    this.httpClient.get(AppConstants.API_URL + 'flujo_client_getallchangemaker')
      .subscribe(
      data => {
        console.log(data);
        this.changemakerData = data;
        this.spinnerService.hide();
      },
      error => {
        console.log(error);
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
        id: this.changemakerData.id, name: this.changemakerData.name, email: this.changemakerData.email,
        phone: this.changemakerData.phone, date_now: this.changemakerData.datenow
      },
    ];
    const exporter = CSVExportService.create({
      columns: csvColumnsList,
      headers: csvColumnsMap,
      includeHeaders: true,
    });
    exporter.downloadCSV(this.changemakerData);
  }
  getuserFeedbackData() {
    this.spinnerService.show();
    this.httpClient.get(AppConstants.API_URL + 'flujo_client_getfeedback/' + AppConstants.CLIENT_ID)
      .subscribe(
      data => {
        this.feedbackData = data;
        this.spinnerService.hide();
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

  getReportYourProblemData() {
    this.spinnerService.show();
    this.httpClient.get(AppConstants.API_URL + '/flujo_client_getreportproblem/' + AppConstants.CLIENT_ID)
      .subscribe(
      data => {
        console.log(data);
        this.reportProblemData = data;
        console.log(this.reportProblemData.submitted_at);
        this.spinnerService.hide();
      },
      error => {
        console.log(error);
      });
  }
  exportReportProblemData() {
    const csvColumnsList = ['id', 'name', 'email', 'phone', 'Problem', 'datenow'];
    const csvColumnsMap = {
      id: 'S.no',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      Problem: 'Problem',
      datenow: 'Submited At'
    };
    const Data = [
      {
        id: this.reportProblemData[0].id, name: this.reportProblemData[0].name, email: this.reportProblemData[0].email,
        phone: this.reportProblemData[0].phone,
        Problem: this.reportProblemData[0].Problem, datenow: this.reportProblemData[0].submitted_at
      },
    ];
    const exporter = CSVExportService.create({
      columns: csvColumnsList,
      headers: csvColumnsMap,
      includeHeaders: true,
    });
    exporter.downloadCSV(this.reportProblemData);
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
  // tslint:disable-next-line:member-ordering
  options = [
    'One',
    'Two',
    'Three'
  ];
  // tslint:disable-next-line:member-ordering
  filteredOptions: Observable<string[]>;
}
