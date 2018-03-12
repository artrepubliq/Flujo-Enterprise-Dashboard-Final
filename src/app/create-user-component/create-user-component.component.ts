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
@Component({
  selector: 'app-create-user-component',
  templateUrl: './create-user-component.component.html',
  styleUrls: ['./create-user-component.component.scss']
})
export class CreateUserComponentComponent implements OnInit {
  isAddUser: boolean;
  userDetails: ICreateUserDetails;
  CreateUserForm: any;
  public loading = false;
  public isEdit = true;
  button_text = 'save';
  // model=new User(1,'','','','');

  PHONE_REGEXP = /^([0]|\+91)?[789]\d{9}$/;
  EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;

  constructor(public dialog: MatDialog, private alertService: AlertService, private formBuilder: FormBuilder, private spinnerService: Ng4LoadingSpinnerService,
    private httpClient: HttpClient) {
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
  }

  ngOnInit() {
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
    let dialogRef = this.dialog.open(AccessLevelPopup, {
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
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'access-level.popup.html',
  styleUrls: ['./create-user-component.component.scss']
})
export class AccessLevelPopup {
  accessLevelsFormSubmit: FormGroup;
  names:Array<IAccessLevelModel>;
  checkedone = false;
  color = 'warn';
  checkedtwo = false;
  public eventCalls: Array<string> = [];
  constructor(
    public dialogRef: MatDialogRef<AccessLevelPopup>,
    @Inject(MAT_DIALOG_DATA) public data: any,private formBuilder: FormBuilder, private spinnerService: Ng4LoadingSpinnerService, private alertService: AlertService,private httpClient:HttpClient) { dialogRef.disableClose = true;
      this.accessLevelsFormSubmit=formBuilder.group({
        'access_levels':[null],
        'user_id':[null],
        'client_id':[null]
      });
      this.checkBoxNames();
    }

  onNoClick(): void {
    console.log(this.data);
    this.dialogRef.close();
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
  testChange(event,i,values,featureId) {
    // console.log(this.names);
    this.names[i][values] = event.checked;
    if (values === 'enable') {
      this.names[i]['read'] =event.checked;
      this.names[i]['write'] =event.checked;
      console.log("test if");
    }
    else {
      this.checkedtwo = false;
      this.checkedone = false;
    }
  }
  checkBoxNames = () =>{
    
    this.names = [

    {
      name:'CMS',
      feature_id:1,
      enable:true,
      read:true,
      write:true,
    },
    {
      name:'Team',
      feature_id:2,
      enable:true,
      read:true,
      write:true
    },
    {
      name:'Repository',
      feature_id:3,
      enable:true,
      read:true,
      write:true
    },
    {
      name:'Social',
      feature_id:4,
      enable:true,
      read:true,
      write:true
    },
    {
      name:'Mail',
      feature_id:5,
      enable:true,
      read:true,
      write:true
    },
    {
      name:'SMS',
      feature_id:6,
      enable:true,
      read:true,
      write:true
    },
    {
      name:'Report an issue',
      feature_id:7,
      enable:true,
      read:true,
      write:true
    },
    {
      name:'Feedback',
      feature_id:8,
      enable:true,
      read:true,
      write:true
    },
    {
      name:'Flow',
      feature_id:9,
      enable:true,
      read:true,
      write:true
    },
    ]
  }
  onSubmit = (body) =>{
    this.spinnerService.show();
    this.accessLevelsFormSubmit.controls['access_levels'].setValue(this.names);
    this.accessLevelsFormSubmit.controls['client_id'].setValue(AppConstants.CLIENT_ID);
    this.accessLevelsFormSubmit.controls['user_id'].setValue(localStorage.getItem('id_token'));
    const formModel = this.accessLevelsFormSubmit.value;
    this.httpClient.post(AppConstants.API_URL + 'flujo_client_postuseraccess', formModel)
      .subscribe(
      data => {
        this.alertService.success('User access levels updated successfully');
        this.spinnerService.hide();
        this.closeDialog();
      },
      error => {
        this.spinnerService.hide();
        this.alertService.danger('User access levels not updated');
      });
  }
}
