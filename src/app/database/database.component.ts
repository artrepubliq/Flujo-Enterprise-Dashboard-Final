import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.scss']
})
export class DatabaseComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  displayedColumns = ['name', 'email', 'phone'];
  dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  /**
   * Set the paginator after the view init since this component will
   * be able to query its view for the initialized paginator.
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
export interface Element {
  name: string;
  email: string;
  phone: string;
}

const ELEMENT_DATA: Element[] = [
  { name: 'Hydrogen', email: 'krishna@flujo.in', phone: '9000922211'},
  { name: 'Helium', email: 'mahesh@flujo.in', phone: '9030924614'},
  { name: 'Lithium', email: 'ajay@flujo.in', phone: '9030924614'},
  { name: 'Beryllium', email: 'santosh@flujo.in', phone: '9030924614'},
  { name: 'Boron', email: 'harish@flujo.in', phone: '9030924614'},
  { name: 'Carbon', email: 'keerthan@flujo.in', phone: '9030924614'},
  { name: 'Nitrogen', email: 'himakar@flujo.in', phone: '9030924614'},
  { name: 'Oxygen', email: 'yogesh@flujo.in', phone: '9030924614'},
  { name: 'Fluorine', email: 'goutham@flujo.in', phone: '9030924614'},
  { name: 'Neon', email: 'abhilash@flujo.in', phone: '9030924614'},
  { name: 'Sodium', email: 'abhiram@flujo.in', phone: '9030924614'},
  { name: 'Magnesium', email: 'pradeep@flujo.in', phone: '9030924614'},
  { name: 'Aluminum', email: 'krishna@flujo.in', phone: '9030924614'},
  { name: 'Silicon', email: 'krishna@flujo.in', phone: '9030924614'},
  { name: 'Phosphorus', email: 'krishna@flujo.in', phone: '9030924614'},
  { name: 'Sulfur', email: 'krishna@flujo.in', phone: '9030924614'},
  { name: 'Chlorine', email: 'krishna@flujo.in', phone: '9030924614'},
  { name: 'Argon', email: 'krishna@flujo.in', phone: '9030924614'},
  { name: 'Potassium', email: 'krishna@flujo.in', phone: '9030924614'},
  { name: 'Calcium', email: 'krishna@flujo.in', phone: '9030924614'},
];
