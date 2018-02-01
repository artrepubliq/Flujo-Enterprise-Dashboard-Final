
import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { HttpService } from '../service/httpClient.service';
import { ValidationService } from '../service/validation.service';
import { AlertModule, AlertService } from 'ngx-alerts';
import CSVExportService from 'json2csvexporter';

import { IUserFeedback, IUserChangemaker } from '../model/feedback.model';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Component({
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent { 
    isFeedbackReport: boolean = true;
    isChangeReport:boolean=false;
    loading: boolean = false;
    isReportData:boolean=false;
    public feedbackData: any;
    changemakerData: any;
    public reportProblemData:any;
    showEmailClickFeedback:boolean = false;
    showEmailClick: boolean = false;
    showEmailClickReport:boolean = false;
  constructor(private spinnerService: Ng4LoadingSpinnerService,private formBuilder: FormBuilder, private httpService: HttpService, private alertService: AlertService) {
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
       this.httpService.getAll("/flujo_client_changereport")
       .subscribe(
        data => {
          console.log(data);
            this.changemakerData = data;
            this.spinnerService.hide();
        },
        error => {
            console.log(error);
        })

  
    // this.http
    //   .get<RUser>('http://flujo.in/dashboard/flujo.in_ajay/public/changereport')
    //   .subscribe(
    //   // Successful responses call the first callback.
    //   data => {
    //     this.changemakerData = data;
    //     // console.log(this.reportData)
    //   },
    //   // Errors will call this callback instead:
    //   err => {
    //     // console.log('Something went wrong!');
    //   }
    //   );
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
    this.httpService.getAll("/flujo_client_feedbackreport")
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
    this.httpService.getAll("/flujo_client_reportproblem/{client_id}")
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
}