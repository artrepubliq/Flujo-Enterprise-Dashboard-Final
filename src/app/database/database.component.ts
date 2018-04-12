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

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.scss']
})

export class DatabaseComponent implements OnInit, AfterViewInit {
  dataURL: any;
  userAccessDataModel: AccessDataModelComponent;
  ELEMENT_DATA: Array<ElementResult>;
  // tslint:disable-next-line:member-ordering
  displayedColumns = ['id', 'name', 'email', 'phone'];
  dataSource = new MatTableDataSource<ElementResult>();
  sendEmail: FormGroup;
  dataCount: number;
  fields = ['ID', 'NAME', 'EMAIL', 'PHONE'];
  config: any;
  feedbackCsvMailSubmit: any;
  feedbackCsvMail: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  feature_id = 10;
  constructor(private http: HttpClient, private router: Router) {
    this.sendEmail = new FormGroup({
      email: new FormControl('email')
    });
    if (Number(localStorage.getItem('feature_id')) !== this.feature_id) {
      this.userAccessDataModel = new AccessDataModelComponent(http, router);
      this.userAccessDataModel.setUserAccessLevels(null, this.feature_id, 'admin/database');
    }
  }
  ngOnInit() {

    this.getData();
  }

  /**
 * Set the paginator after the view init since this component will
 * be able to query its view for the initialized paginator.
 */
  ngAfterViewInit() {
    console.log(this.dataSource);
    this.dataSource.paginator = this.paginator;
  }

  async getData() {
    try {
      this.dataURL = `http://www.flujo.in/dashboard/flujo.in_api_client/flujo_client_getdata/${AppConstants.CLIENT_ID}`;
      this.http.get<Array<ElementResult>>(this.dataURL)
        .subscribe((data) => {
          // console.log(data);
          if (data) {
            this.dataSource.data = data;
            this.dataCount = data.length;
          }
        }, (error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

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
}


