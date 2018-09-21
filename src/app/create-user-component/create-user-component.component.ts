import { Component, OnInit, Inject } from '@angular/core';
// import { User }    from '../user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { HttpService } from '../service/httpClient.service';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../app.constants';
import { AlertModule, AlertService } from 'ngx-alerts';
import { ICreateUserDetails } from '../model/createUser.model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material';
import { IAccessLevelModel } from '../model/accessLevel.model';
import * as _ from 'underscore';
import { json } from 'body-parser';
import { Injectable } from '@angular/core';
import { AdminComponent } from '../admin/admin.component';
import { Router } from '@angular/router';
import { ICommonInterface } from '../model/commonInterface.model';
import { AccessLevelPopup } from '../dialogs/create-useraccesslevels-popup/create-useraccesslevels-popup';
import { UserAccesslevelsService } from '../service/user-accesslevels.service';
import { IUserAccessLevels, IUserFeatures } from '../model/user-accesslevels.model';
@Injectable()
@Component({
  selector: 'app-create-user-component',
  templateUrl: './create-user-component.component.html',
  styleUrls: ['./create-user-component.component.scss']
})
export class CreateUserComponentComponent implements OnInit {
  checked: false;
  filteredUserAccessData: any;
  userAccessLevelObject: any;
  isAddUser: boolean;
  userDetails: any;
  CreateUserForm: any;
  // public loading = false;
  public isEdit = true;
  button_text = 'save';
  config: any;
  feature_id = 17;
  PHONE_REGEXP = /^([0]|\+91)?[6789]\d{9}$/;
  EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
  constructor(public dialog: MatDialog, private alertService: AlertService,
    private formBuilder: FormBuilder, private spinnerService: Ng4LoadingSpinnerService,
    private userAccessLevelService: UserAccesslevelsService,
    private httpClient: HttpClient, private router: Router) {
    this.CreateUserForm = this.formBuilder.group({
      'name': ['', Validators.pattern('^[a-zA-Z \-\']+')],
      'email': ['', Validators.compose([Validators.required, Validators.pattern(this.EMAIL_REGEXP)])],
      'phone': ['', Validators.compose([Validators.required, Validators.pattern(this.PHONE_REGEXP)])],
      'role': ['', Validators.required],
      'access_levels': [null],
      'admin_id': [null],
      'user_id': [null]
    });
    this.getUsersList();
  }


  ngOnInit() {
  }
  onSubmit = (body) => {
    this.spinnerService.show();
    // console.log(this.userDetails.id);
    this.CreateUserForm.controls['admin_id'].setValue(AppConstants.CLIENT_ID);
    const accessLevelsArray = [];
    const accessLevelsObject = <IUserFeatures>{};
    accessLevelsObject.feature_id = '11';
    accessLevelsObject.sub_feature_ids = ['SF_1', 'SF_2'];
    accessLevelsArray.push(accessLevelsObject);
    this.CreateUserForm.controls['access_levels'].setValue(accessLevelsArray);
    const formModel = this.CreateUserForm.value;
    this.httpClient.post<ICommonInterface>(AppConstants.API_URL + 'flujo_client_postcreateuser', formModel)
      .subscribe(
        data => {
          this.CreateUserForm.reset();
          if (!data.error && (data.custom_status_code = 100)) {
            this.alertService.success('User added succesfully');
            this.CreateUserForm.reset();
            this.isEdit = false;
            this.button_text = 'save';
            this.getUsersList();
          } else if (data.error === true && data.custom_status_code === 130) {
            this.alertService.danger('Failed to create user!');
          } else {
            this.parsePostResponse(data);
          }
          // this.alertService.info('User added succesfully');
          this.spinnerService.hide();
        },
        error => {
          this.spinnerService.hide();
          this.alertService.danger('User not added');
        });
  }
  onDelete = (body) => {
    // const formModel = this.form.value;
    this.spinnerService.show();
    const user_id = body.id;
    // this.CreateUserForm.controls['admin_id'].setValue(AppConstants.CLIENT_ID);
    this.httpClient.delete<ICommonInterface>(AppConstants.API_URL + 'flujo_client_deletecreateuser/' + user_id)
      .subscribe(
        data => {
          if (data.custom_status_code === 100) {
            this.alertService.success('User deleted successfully');
            this.getUsersList();
            // this.loading = false;
          } else if (data.custom_status_code === 102) {
            this.alertService.warning('Required parameters are missing!!!');
          }
          this.spinnerService.hide();
          // console.log(data);
        },
        error => {
          // this.loading = false;
          this.spinnerService.hide();
          this.alertService.danger('Something went wrong');
        });
  }

  getUsersList() {
    // this.spinnerService.show();
    this.httpClient.get<ICommonInterface>(AppConstants.API_URL + 'flujo_client_getcreateuser/' + AppConstants.CLIENT_ID)
      .subscribe(
        data => {
          // this.spinnerService.hide();
          if (data.custom_status_code === 100 && data.result.length > 0) {
            data.result ? this.isEdit = false : this.isEdit = true;
            console.log(data);
            this.userDetails = data.result;
          }
        },
        error => {
          // console.log(error);
          // this.spinnerService.hide();
        }
      );
  }
  openAccessDialog(userItem): void {
    const dialogRef = this.dialog.open(AccessLevelPopup, {
      width: '45vw',
      height: '70vh',
      data: userItem,
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
    });
  }

  setDefaultClientUserDetails = (userData) => {

    if (userData) {
      // this.button_text = "Update";
      this.CreateUserForm.controls['name'].setValue(userData.name);

      // this.CreateUserForm.controls['last_name'].setValue(userData.last_name);

      this.CreateUserForm.controls['email'].setValue(userData.email);
      this.CreateUserForm.controls['phone'].setValue(userData.phone);
      this.CreateUserForm.controls['role'].setValue(userData.role);
      this.CreateUserForm.controls['user_id'].setValue(userData.id);
      // console.log(this.CreateUserForm.value);
    }

  }
  addUsers = () => {
    this.CreateUserForm.reset();
    this.isEdit = true;
    this.isAddUser = true;
  }
  editCompnent = (userItem) => {
    // this.alertService.success('User updated successfull.');
    this.isEdit = true;
    this.isAddUser = true;
    this.button_text = 'Update';
    this.setDefaultClientUserDetails(userItem);
    // console.log(userItem);
  }
  parsePostResponse(data) {
    if (data.custom_status_code === 102) {
      this.alertService.warning('Everything is Up-to-date!!!');
    } else if (data.custom_status_code === 100 && (typeof (data.result) === 'object')) {
      this.alertService.success('User updated successfully!!!');
      this.CreateUserForm.reset();
      this.isEdit = false;
      this.button_text = 'save';
      this.getUsersList();
    } else if (data.custom_status_code === 100 && (typeof (data.result) === 'string')) {
      this.alertService.success('User created successfully!!!');
      this.CreateUserForm.reset();
      this.isEdit = false;
      this.button_text = 'save';
      this.getUsersList();
    } else if (data.custom_status_code === 101) {
      this.alertService.warning('Required Parameters are Missing!!!');
    } else if (data.custom_status_code === 105) {
      this.alertService.warning('Email Already Exists!!!');
    } else if (data.custom_status_code === 130) {
      this.alertService.warning('Failed to create user!!!');
    }
  }
  selectAll() {
    for (let i = 0; i < this.userDetails.length; i++) {
      this.userDetails[i].selected = this.checked;
    }
  }
  cancelUser() {
    this.isEdit = false;
  }

  public loggedInUser(userId): boolean {
    const loggedInUser = localStorage.getItem('user_id');
    // console.log(userId)
    if (userId === loggedInUser) {
      return true;
    }
    return false;
  }

}
