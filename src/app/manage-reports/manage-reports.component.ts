import { Component, OnInit, Inject } from '@angular/core';
import * as _ from 'underscore';
import { AppConstants } from '../app.constants';
import { HttpClient } from '@angular/common/http';
import { ICreateUserDetails } from '../model/createUser.model';
@Component({
  templateUrl: './manage-reports.component.html',
  styleUrls: ['./manage-reports.component.scss']

})
export class ManageReportsComponent implements OnInit {
    loggedinUsersList: Array<ICreateUserDetails>;
  constructor(public httpClient: HttpClient) {
   }
  ngOnInit() {
    this.getAllReports();
    this.getUserList();
  }
// this function is used for getting reports data from the server
  getAllReports = () => {
    this.httpClient.get(AppConstants.API_URL + 'flujo_client_getreportproblem/' + AppConstants.CLIENT_ID )
    .subscribe(
      data => {
          console.log(data);
      },
      error => {
          console.log(error);
      }
      );
  }
  // this function is used for getting all the users from the database
  getUserList = () => {
    this.httpClient.get<Array<ICreateUserDetails>>(AppConstants.API_URL + 'flujo_client_getcreateuser/' + AppConstants.CLIENT_ID)
      .subscribe(
      data => {
        this.loggedinUsersList = data;
        console.log(this.loggedinUsersList[0].id);
      },
      error => {
        console.log(error);
      }
      );
  }
}
