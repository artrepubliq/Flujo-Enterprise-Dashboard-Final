
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from '@angular/common/http';
import { ValidationService } from '../service/validation.service';
import { AlertModule, AlertService } from 'ngx-alerts';
import CSVExportService from 'json2csvexporter';
import { AppConstants } from '../app.constants';
import { IUserFeedback, IUserChangemaker } from '../model/feedback.model';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Component({
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {
  reportCsvMail: FormGroup;
  changeMakerCsvMail: any;
  feedbackCsvMail: FormGroup;
  isFeedbackReport: boolean = true;
  isChangeReport: boolean = false;
  loading: boolean = false;
  isReportData: boolean = false;
  public feedbackData: any;
  changemakerData: any;
  public reportProblemData: any;
  showEmailClickFeedback: boolean = false;
  showEmailClick: boolean = false;
  showEmailClickReport: boolean = false;
  EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
  constructor(private spinnerService: Ng4LoadingSpinnerService, private formBuilder: FormBuilder, private httpClient: HttpClient, private alertService: AlertService) {
   this.feedbackCsvMail = this.formBuilder.group({
    'email': ['', Validators.compose([Validators.required,Validators.pattern(this.EMAIL_REGEXP)])],
   });
   this.changeMakerCsvMail = this.formBuilder.group({
    'email': ['', Validators.compose([Validators.required,Validators.pattern(this.EMAIL_REGEXP)])],
   });
   this.reportCsvMail = this.formBuilder.group({
    'email': ['', Validators.compose([Validators.required,Validators.pattern(this.EMAIL_REGEXP)])],
   });
export class ReportsComponent { 
    isFeedbackReport: boolean = true;
    isChangeReport:boolean=false;
    loading: boolean = false;
    isReportData:boolean=false;
    public feedbackData: any;
    changemakerData: any;
    feedbackCsvMail:any;
    changeMakerCsvMail:any;
    reportCsvMail:any;
    public reportProblemData:any;

    EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
    constructor(private spinnerService: Ng4LoadingSpinnerService,private formBuilder: FormBuilder, private httpClient: HttpClient, private alertService: AlertService) {
    this.feedbackCsvMail = this.formBuilder.group({
      'email': ['', Validators.compose([Validators.required, Validators.pattern(this.EMAIL_REGEXP)])],
      // 'client_id':[null]
    });
    this.changeMakerCsvMail = this.formBuilder.group({
      'email': ['', Validators.compose([Validators.required, Validators.pattern(this.EMAIL_REGEXP)])],
      // 'client_id':[null]
    });
    this.reportCsvMail = this.formBuilder.group({
      'email': ['', Validators.compose([Validators.required, Validators.pattern(this.EMAIL_REGEXP)])],
      // 'client_id':[null]
    });
    this.getChangemakerReportData();
    this.getuserFeedbackData();
    this.getReportYourProblemData();
   }
   ngOnInit() {
    setTimeout(function() {
        this.spinnerService.hide();
      }.bind(this), 3000);
  }
   showFeedback(){
    this.isFeedbackReport = true;
    this.isReportData = false;
    this.isChangeReport = false;
   }
   showChangemaker(){
    this.isChangeReport = true;
    this.isFeedbackReport = false;
    this.isReportData = false;
   }
   showReportProblem(){
    this.isReportData = true;
    this.isChangeReport = false;
    this.isFeedbackReport = false;
   }

   
   getChangemakerReportData() {
    this.spinnerService.show()
       this.httpClient.get(AppConstants.API_URL+"flujo_client_changereport")
       .subscribe(
        data => {
          console.log(data);
            this.changemakerData = data;
            this.spinnerService.hide();
        },
        error => {
            console.log(error);
            this.spinnerService.hide();
        })
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
        id: this.changemakerData.id, name: this.changemakerData.name, email: this.changemakerData.email, phone: this.changemakerData.phone, date_now: this.changemakerData.datenow
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
    this.httpClient.get(AppConstants.API_URL + "flujo_client_getallfeedback")
      .subscribe(
      data => {
        this.feedbackData = data;
        this.spinnerService.hide();
      },
      error => {
        console.log(error);
      })
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
    this.httpClient.get(AppConstants.API_URL + "flujo_client_getreportproblem/" + AppConstants.CLIENT_ID)
      .subscribe(
      data => {
        console.log(data);
        this.reportProblemData = data;
        this.spinnerService.hide();
      },
      error => {
        console.log(error);
      })
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
        id: this.reportProblemData[0].id, name: this.reportProblemData[0].name, email: this.reportProblemData[0].email, phone: this.reportProblemData[0].phone,
        Problem: this.reportProblemData[0].Problem, datenow: this.reportProblemData[0].datenow
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
    this.httpClient.get(AppConstants.API_URL+"flujo_client_reportproblem/"+AppConstants.CLIENT_ID)
    .subscribe(
     data => {
       console.log(data);
         this.reportProblemData = data;
         this.spinnerService.hide();
     },
     error => {
         console.log(error);
     })
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
          id: this.reportProblemData[0].id, name: this.reportProblemData[0].name, email: this.reportProblemData[0].email, phone: this.reportProblemData[0].phone,
          Problem: this.reportProblemData[0].Problem, datenow: this.reportProblemData[0].datenow
        },
      ];
      const exporter = CSVExportService.create({
        columns: csvColumnsList,
        headers: csvColumnsMap,
        includeHeaders: true,
      });
      exporter.downloadCSV(this.reportProblemData);
    }
    feedbackCsvMailSubmit(){
      this.spinnerService.show();
      console.log(this.feedbackCsvMail.value);
      // this.feedbackCsvMail.controls['client_id'].setValue(AppConstants.CLIENT_ID);
      this.httpClient.post(AppConstants.API_URL+"flujo_client_feedbackreportmailattachment",this.feedbackCsvMail.value)
        .subscribe(
        data => {
            this.spinnerService.hide();
          if (data) {
            this.alertService.info('Attachment has been sent to email successfully');
            this.feedbackCsvMail.reset();
          }else{
          this.alertService.danger('Email could not sent');
          this.feedbackCsvMail.reset();
          }
        },
        error => {
          this.spinnerService.hide();
          console.log(error);
        })
    }

    changeMakerCsvMailSubmit(){
      this.spinnerService.show();
      console.log(this.changeMakerCsvMail.value);
      // this.changeMakerCsvMail.controls['client_id'].setValue(AppConstants.CLIENT_ID);
      this.httpClient.post(AppConstants.API_URL+"flujo_client_changemakerreportmailattachment",this.changeMakerCsvMail.value)
        .subscribe(
        data => {
            this.spinnerService.hide();
          if (data) {
            this.alertService.info('Attachment has been sent to email successfully');
            this.changeMakerCsvMail.reset();
          }else{
          this.alertService.danger('Email could not sent');
          this.changeMakerCsvMail.reset();
          }
        },
        error => {
          this.spinnerService.hide();
          console.log(error);
        })
    }
    reportCsvMailSubmit(){
      this.spinnerService.show();
      console.log(this.reportCsvMail.value);
      // this.reportCsvMail.controls['client_id'].setValue(AppConstants.CLIENT_ID);
      this.httpClient.post(AppConstants.API_URL+"flujo_client_reportproblemreportmailattachment",this.reportCsvMail.value)
        .subscribe(
        data => {
            this.spinnerService.hide();
          if (data) {
            this.alertService.info('Attachment has been sent to email successfully');
            this.reportCsvMail.reset();
          }else{
          this.alertService.danger('Email could not sent');
          this.reportCsvMail.reset();
          }
        },
        error => {
          this.spinnerService.hide();
          console.log(error);
        })
    }
}