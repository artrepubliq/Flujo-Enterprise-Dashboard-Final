import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AppConstants } from '../app.constants';
import { Element, ElementResult } from '../model/database.model';
import { FormGroup, FormControl } from '@angular/forms';
import { ElementData } from '@angular/core/src/view';
import {CsvService} from "angular2-json2csv";

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
  myGroup: FormGroup;
  dataCount: number;
  fields = ['ID', 'NAME', 'EMAIL', 'PHONE'];


  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private http: HttpClient, private _csvService: CsvService) {
    this.myGroup = new FormGroup({
      email: new FormControl('email')
    });
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
    this._csvService.download(this.dataSource.data, 'database');
  }
}


//  ELEMENT_DATA: Element[] = [
//   { name: 'Hydrogen', email: 'krishna@flujo.in', phone: '9000922211'},
//   { name: 'Helium', email: 'mahesh@flujo.in', phone: '9030924614'},
//   { name: 'Lithium', email: 'ajay@flujo.in', phone: '9030924614'},
//   { name: 'Beryllium', email: 'santosh@flujo.in', phone: '9030924614'},
//   { name: 'Boron', email: 'harish@flujo.in', phone: '9030924614'},
//   { name: 'Carbon', email: 'keerthan@flujo.in', phone: '9030924614'},
//   { name: 'Nitrogen', email: 'himakar@flujo.in', phone: '9030924614'},
//   { name: 'Oxygen', email: 'yogesh@flujo.in', phone: '9030924614'},
//   { name: 'Fluorine', email: 'goutham@flujo.in', phone: '9030924614'},
//   { name: 'Neon', email: 'abhilash@flujo.in', phone: '9030924614'},
//   { name: 'Sodium', email: 'abhiram@flujo.in', phone: '9030924614'},
//   { name: 'Magnesium', email: 'pradeep@flujo.in', phone: '9030924614'},
//   { name: 'Aluminum', email: 'krishna@flujo.in', phone: '9030924614'},
//   { name: 'Silicon', email: 'krishna@flujo.in', phone: '9030924614'},
//   { name: 'Phosphorus', email: 'krishna@flujo.in', phone: '9030924614'},
//   { name: 'Sulfur', email: 'krishna@flujo.in', phone: '9030924614'},
//   { name: 'Chlorine', email: 'krishna@flujo.in', phone: '9030924614'},
//   { name: 'Argon', email: 'krishna@flujo.in', phone: '9030924614'},
//   { name: 'Potassium', email: 'krishna@flujo.in', phone: '9030924614'},
//   { name: 'Calcium', email: 'krishna@flujo.in', phone: '9030924614'},
// ];
