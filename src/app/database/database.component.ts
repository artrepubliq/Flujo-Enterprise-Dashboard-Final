import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AppConstants } from '../app.constants';
import { Element, ElementResult } from '../model/database.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ElementData } from '@angular/core/src/view';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { AlertService } from 'ngx-alerts';

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.scss']
})

export class DatabaseComponent implements OnInit, AfterViewInit {
  dataURL: any;
  ELEMENT_DATA: Array<ElementResult>;
  // tslint:disable-next-line:member-ordering
  displayedColumns = ['id', 'name', 'email', 'phone'];
  dataSource = new MatTableDataSource<ElementResult>();
  dataCount: number;
  fields = ['ID', 'NAME', 'EMAIL', 'PHONE'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private http: HttpClient,
    private alertService: AlertService) {
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

 postEmail(emailid: string) {
   if (emailid) {
      try {
        console.log(emailid);
        this.dataURL = `http://www.flujo.in/dashboard/flujo.in_api_client/flujo_client_emaildatabase/${emailid}`;
        this.http.get(this.dataURL)
          .subscribe((data) => {
            console.log(data);
            if (data['result'] === true) {
              this.alertService.success('Email sent!');
              console.log('Email sent!');
            } else {
              this.alertService.warning('Something went wrong');
              console.log('Email could not be sent.');
            }
          }, (error) => {
            this.alertService.warning('Something went wrong');
            console.log(error);
          });
      } catch (error) {
        this.alertService.warning('Something went wrong');
        console.log(error);
      }
    } else {
      this.alertService.warning('Email ID Required');
    }
  }
}


