import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AppConstants } from '../app.constants';
import { Element, ElementResult } from '../model/database.model';
import { FormGroup, FormControl, EmailValidator } from '@angular/forms';
import { ElementData } from '@angular/core/src/view';
import { Angular2Csv } from 'angular2-csv';
import { AccessDataModelComponent } from '../model/useraccess.data.model';
import { Router } from '@angular/router';
import { ICommonInterface } from '../model/commonInterface.model';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AlertService } from 'ngx-alerts';
import { IActiveHeader } from '../model/active-header.model';

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.scss']
})

export class DatabaseComponent implements OnInit, AfterViewInit {
  dataURL: any;
  public ActiveHeader: IActiveHeader;
  userAccessDataModel: AccessDataModelComponent;
  ELEMENT_DATA: Array<ElementResult>;
  // tslint:disable-next-line:member-ordering
  displayedColumns = ['id', 'name', 'email', 'phone'];
  dataSource = new MatTableDataSource<ElementResult>();
  dataCount: number;
  fields = ['ID', 'NAME', 'EMAIL', 'PHONE'];
  config: any;
  feedbackCsvMailSubmit: any;
  feedbackCsvMail: any;
  postEmailValue: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  feature_id = 10;
  // tslint:disable-next-line:max-line-length
  constructor(private http: HttpClient, private router: Router, private spinnerService: Ng4LoadingSpinnerService, private alertService: AlertService) {

    if (Number(localStorage.getItem('feature_id')) !== this.feature_id) {
      this.userAccessDataModel = new AccessDataModelComponent(http, router);
      this.userAccessDataModel.setUserAccessLevels(null, this.feature_id, 'admin/database');
    }
    this.ActiveHeader = {
      feedback: false,
      change_maker: false,
      surveys: false,
      database: true
    };
  }
  ngOnInit() {

    this.getData();
  }

  /**
 * Set the paginator after the view init since this component will
 * be able to query its view for the initialized paginator.
 */
  ngAfterViewInit() {
    // console.log(this.dataSource);
    this.dataSource.paginator = this.paginator;
  }

  // get data from database
  async getData() {
    try {
      this.dataURL = AppConstants.API_URL + `/flujo_client_getdata/${AppConstants.CLIENT_ID}`;
      this.http.get<ICommonInterface>(this.dataURL)
        .subscribe((data) => {
          this.spinnerService.hide();
          if (!data.error || data.access_token === AppConstants.ACCESS_TOKEN) {
            this.dataSource.data = data.result;
            this.dataCount = data.result.length;
          } else {
            this.alertService.warning('Something went wrong.');
          }
        });
    } catch (error) {
      // console.log(error);
    }
  }

  // applies filter
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  // generate csv and download
  generateCSV() {
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      useBom: true,
      headers: [
        'Name',
        'Email',
        'Phone'
      ]
    };
    const csv = new Angular2Csv(this.dataSource.data, 'My Report', options);

  }

  // validate and send email
  sendEmail() {
    // console.log(this.postEmailValue);
    // validate email or show error
    if (this.validateEmail(this.postEmailValue)) {
      // console.log('Got valid email id');
      // console.log(this.postEmailValue);
      this.dataURL = AppConstants.API_URL + '/flujo_client_emaildatabase/' + this.postEmailValue;
      // console.log(this.dataURL);
      this.http.get<ICommonInterface>(this.dataURL)
        .subscribe((data) => {
          // console.log(data);
          if (!data.error || data.access_token === AppConstants.ACCESS_TOKEN) {
            this.alertService.success('Email sent!');
          } else {
            this.alertService.warning('Something went wrong');
          }
        },
          (error) => {
            this.alertService.warning('Something went wrong');
          });
    } else {
      // console.log('Enter valid email id');
      this.alertService.warning('Enter valid Email ID');
    }
  }

  validateEmail(email: string) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return true;
    } else {
      return false;
    }
  }
}


