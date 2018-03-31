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
@Injectable()
@Component({
  selector: 'app-create-user-component',
  templateUrl: './create-user-component.component.html',
  styleUrls: ['./create-user-component.component.scss']
})
export class CreateUserComponentComponent implements OnInit {
  filteredUserAccessData: any;
  userAccessLevelObject: any;
  isAddUser: boolean;
  userDetails: ICreateUserDetails;
  CreateUserForm: any;
  public loading = false;
  public isEdit = true;
  button_text = 'save';
  // model=new User(1,'','','','');

  PHONE_REGEXP = /^([0]|\+91)?[789]\d{9}$/;
  EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
  constructor(public dialog: MatDialog, private alertService: AlertService,
    private formBuilder: FormBuilder, private spinnerService: Ng4LoadingSpinnerService,
    private httpClient: HttpClient, private router: Router, public adminComponent: AdminComponent) {
    this.CreateUserForm = this.formBuilder.group({

      'name': ['', Validators.pattern('^[a-zA-Z \-\']+')],
      // 'first_name': ['', Validators.pattern('^[a-zA-Z \-\']+')],
      //  'last_name': ['', Validators.pattern('^[a-zA-Z \-\']+')],
      // 'user_password': ['', Validators.required],

      'email': ['', Validators.compose([Validators.required, Validators.pattern(this.EMAIL_REGEXP)])],
      'phone': ['', Validators.compose([Validators.required, Validators.pattern(this.PHONE_REGEXP)])],
      'role': ['', Validators.required],
      'admin_id': [null],
      'user_id': [null]
    });
    this.getUsersList();
    if (this.adminComponent.userAccessLevelData) {
      console.log(this.adminComponent.userAccessLevelData[0].name);
      this.userRestrict();
    } else {
      this.adminComponent.getUserAccessLevelsHttpClient()
        .subscribe(
          resp => {
            console.log(resp);
            this.spinnerService.hide();
            _.each(resp, item => {
              if (item.user_id === localStorage.getItem('user_id')) {
                  this.userAccessLevelObject = item.access_levels;
              }else {
                // this.userAccessLevelObject = null;
              }
            });
            this.adminComponent.userAccessLevelData = JSON.parse(this.userAccessLevelObject);
            this.userRestrict();
          },
          error => {
            console.log(error);
            this.spinnerService.hide();
          }
        );
    }
  }

  ngOnInit() {
  }
  userRestrict() {
    _.each(this.adminComponent.userAccessLevelData, (item, iterate) => {
      // tslint:disable-next-line:max-line-length
      if (this.adminComponent.userAccessLevelData[iterate].name === 'User Management' && this.adminComponent.userAccessLevelData[iterate].enable) {
        this.filteredUserAccessData = item;
      } else {
        // this.router.navigate(['/accessdenied']);
        // console.log('else');
      }
    });
    if (this.filteredUserAccessData.name) {
      this.router.navigate(['/user']);
    }else {
      this.router.navigate(['/accessdenied']);
      console.log('else');
    }
  }
  onSubmit = (body) => {
    this.spinnerService.show();
    console.log(this.userDetails.id);
    this.CreateUserForm.controls['admin_id'].setValue(AppConstants.CLIENT_ID);
    const formModel = this.CreateUserForm.value;
    this.httpClient.post(AppConstants.API_URL + 'flujo_client_postcreateuser', formModel)
      .subscribe(
        data => {
          this.CreateUserForm.reset();
          this.parsePostResponse(data);
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
    this.httpClient.delete(AppConstants.API_URL + 'flujo_client_deletecreateuser/' + user_id)
      .subscribe(
        data => {
          this.getUsersList();
          this.spinnerService.hide();
          console.log(data);
          this.loading = false;
          this.alertService.warning('User delete successfully');
        },
        error => {
          this.loading = false;
          this.spinnerService.hide();
          this.alertService.danger('Something went wrong');
        });
  }

  getUsersList() {
    this.spinnerService.show();
    this.httpClient.get<ICreateUserDetails>(AppConstants.API_URL + '/flujo_client_getcreateuser/' + AppConstants.CLIENT_ID)
      .subscribe(
        data => {
          data ? this.isEdit = false : this.isEdit = true;
          console.log(data);
          this.userDetails = data;
          console.log(this.userDetails);
          this.spinnerService.hide();
        },
        error => {
          console.log(error);
          this.spinnerService.hide();
        }
      );
  }
  openAccessDialog(userItem): void {
    const dialogRef = this.dialog.open(AccessLevelPopup, {
      width: '45vw',
      data: userItem,
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
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
      console.log(this.CreateUserForm.value);
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
    console.log(userItem);
  }
  parsePostResponse(response) {

    if (response.result) {
      this.alertService.danger('Email ID already existed');
    } else {
      this.alertService.info('User data submitted successfully.');
      this.CreateUserForm.reset();
      this.getUsersList();
      this.isEdit = false;
      this.button_text = 'save';

    }
  }

  cancelUser() {
    this.isEdit = false;
  }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'access-level.popup.html',
  styleUrls: ['./create-user-component.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class AccessLevelPopup {
  filteredAccessIds: Array<IAccessLevelModel>;
  userAccessId: string;
  accessLevelsFormSubmit: FormGroup;
  names: Array<IAccessLevelModel>;
  checkedone = false;
  color = 'primary';
  checkedtwo = false;
  accessLevelData: Array<object>;
  // accessLevelRawData:Array<IAccesLevels>;
  public eventCalls: Array<string> = [];
  constructor(
    public dialogRef: MatDialogRef<AccessLevelPopup>,
    @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder,
     private spinnerService: Ng4LoadingSpinnerService, private alertService: AlertService, private httpClient: HttpClient) {
    dialogRef.disableClose = true;
    this.accessLevelsFormSubmit = formBuilder.group({
      'access_levels': [null],
      'user_id': [null],
      'client_id': [null],
    });
    this.checkBoxNames();
    this.getAccessLevelData();
    console.log(data.id);
  }

  onNoClick(): void {
    console.log(this.data);
    this.dialogRef.close();
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
  testChange(event, i, values, featureId, UserId) {
    this.accessLevelData[i][values] = event.checked;
    if (values === 'enable') {
      this.accessLevelData[i]['read'] = event.checked;
      this.accessLevelData[i]['write'] = event.checked;
    }
    // If two are true enable will be true
    if (this.accessLevelData[i]['read'] && this.accessLevelData[i]['write'] === true) {
      this.accessLevelData[i]['enable'] = event.checked = true;
    }
    // If two are false enable will be false
    if (this.accessLevelData[i]['read'] === false && this.accessLevelData[i]['write'] === false) {
      this.accessLevelData[i]['enable'] = event.checked = false;
    }
    // If either one is true enable will need to true
    if (this.accessLevelData[i]['read'] === true || this.accessLevelData[i]['write'] === true) {
      this.accessLevelData[i]['enable'] = event.checked = true;
    }
  }
  checkBoxNames = () => {
    const defaultData: Array<IAccessLevelModel> = [
      { name: 'Editor', feature_id: 1, enable: true, read: true, write: true, order: '1' },
      { name: 'Social', feature_id: 2, enable: true, read: true, write: true,  order: '2'},
      { name: 'Mail', feature_id: 3, enable: true, read: true, write: true , order: '3'},
      { name: 'SMS', feature_id: 4, enable: true, read: true, write: true , order: '4'},
      { name: 'Report an issue', feature_id: 5, enable: true, read: true, write: true , order: '5'},
      { name: 'Analytics', feature_id: 6, enable: true, read: true, write: true , order: '6'},
      { name: 'Feedback', feature_id: 7, enable: true, read: true, write: true , order: '7'},
      { name: 'Change Maker', feature_id: 8, enable: true, read: true, write: true, order: '8'},
      { name: 'Surveys', feature_id: 9, enable: true, read: true, write: true, order: '9'},
      { name: 'Database', feature_id: 10, enable: true, read: true, write: true, order: '10'},
      { name: 'Drive', feature_id: 11, enable: true, read: true, write: true, order: '11'},
      { name: 'Team', feature_id: 12, enable: true, read: true, write: true, order: '12'},
      { name: 'Logo', feature_id: 13, enable: true, read: true, write: true, order: '13'},
      { name: 'Media Management', feature_id: 14, enable: true, read: true, write: true, order: '14'},
      { name: 'Theme Global Config', feature_id: 15, enable: true, read: true, write: true, order: '15'},
      { name: 'SMTP', feature_id: 16, enable: true, read: true, write: true, order: '16'},
      { name: 'User Management', feature_id: 17, enable: true, read: true, write: true, order: '17'},
      { name: 'Social links update', feature_id: 18, enable: true, read: true, write: true, order: '18'},
      { name: 'Biography', feature_id: 19, enable: true, read: true, write: true, order: '19'},
      { name: 'Create Module', feature_id: 20, enable: true, read: true, write: true, order: '20'},
      { name: 'Terms & Conditions', feature_id: 21, enable: true, read: true, write: true, order: '21'},
      { name: 'Privacy & Policy', feature_id: 22, enable: true, read: true, write: true, order: '22'},
      { name: 'Change Password', feature_id: 23, enable: true, read: true, write: true, order: '23'},
      { name: 'Problem Category', feature_id: 24, enable: true, read: true, write: true, order: '24'},
      { name: 'Area Category', feature_id: 25, enable: true, read: true, write: true, order: '25'},
      { name: 'Settings', feature_id: 26, enable: true, read: true, write: true, order: '26'},
    ];
    return defaultData;
  }
  // Posting of user access level data to api
  onSubmit = (body) => {
    this.spinnerService.show();
    this.accessLevelsFormSubmit.controls['access_levels'].setValue(this.accessLevelData);
    this.accessLevelsFormSubmit.controls['client_id'].setValue(AppConstants.CLIENT_ID);
    this.accessLevelsFormSubmit.controls['user_id'].setValue(this.data.id);
    const formModel = this.accessLevelsFormSubmit.value;
    this.httpClient.post(AppConstants.API_URL + 'flujo_client_postuseraccess', formModel)
      .subscribe(
        data => {
          this.alertService.success('User access levels updated successfully');
          this.spinnerService.hide();
          this.getAccessLevelData();
          this.closeDialog();
        },
        error => {
          this.spinnerService.hide();
          this.alertService.danger('User access levels not updated');
        });
  }
  // Getting of user access data if data is not present default checkbox method will call
  getAccessLevelData = () => {
    this.spinnerService.show();
    this.httpClient.get<Array<IAccessLevelModel>>(AppConstants.API_URL + '/flujo_client_getuseraccess/' + AppConstants.CLIENT_ID)
      .subscribe(
        data => {
          if (data.length > 0) {
            this.filteredAccessIds = _.filter(data, (item) => {
              // this.data.id will come from open access dialog and we are comparing selected id and server data id
              return item.user_id === this.data.id;
            });
            if (this.filteredAccessIds.length > 0) {
              this.accessLevelData = JSON.parse(this.filteredAccessIds[0].access_levels);
              this.spinnerService.hide();
            } else {
              this.accessLevelData = this.checkBoxNames();
              this.spinnerService.hide();
            }
          } else {
            this.accessLevelData = this.checkBoxNames();
            this.spinnerService.hide();
          }
        },
        error => {
          console.log(error);
          this.spinnerService.hide();
        }
      );
  }
}
