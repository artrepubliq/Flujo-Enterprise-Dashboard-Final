import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { HttpService } from '../service/httpClient.service';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../app.constants';
import { AlertModule, AlertService } from 'ngx-alerts';
// We haven't defined these services yet
// import { AuthService } from '../auth.service';
import { AuthService } from '../auth/auth.service';
import { LoginAuthService } from '../auth/login.auth.service';
import { Router } from '@angular/router';
import { Keepalive } from '@ng-idle/keepalive';
import { IcustomLoginModelDetails } from '../model/custom.login.model';
import { PasswordValidation } from '../service/confirm-password';
@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent implements OnInit {

  name: string;
  data: string;
  isMatch: boolean;
  changePasswordForm: any;
  constructor(private router: Router, private alertService: AlertService,
    private formBuilder: FormBuilder, private spinnerService: Ng4LoadingSpinnerService, private httpClient:HttpClient) {
      this.changePasswordForm = this.formBuilder.group({
        'old_password':['', Validators.required],
        'new_password':['', Validators.required],
        'confirm_new_password':['', Validators.required],
        'client_id' : [null]
      },{validator: this.checkPasswords});
      
   }
   checkPasswords(group: FormGroup) { 
   let new_password = group.controls.new_password.value;
   let confirm_new_password = group.controls.confirm_new_password.value;
    
   return new_password === confirm_new_password ? null : { isMatch: true }    

 }
   ngOnChanges(){
    //  console.log('testtt');
    //  if (this.MatchPassword) {
    //   this.isMatch = false;
    // }else{
    //   this.isMatch = false;
    // }
    // if(!this.checkPasswords){
    //   this.isMatch = true;
    // }
  }  
  ngOnInit() {
    this.isMatch = false;
  }
  
  onSubmit = (body) => {
    
    this.spinnerService.show();
    this.changePasswordForm.controls['client_id'].setValue(AppConstants.CLIENT_ID);
    const formModel = this.changePasswordForm.value;
    this.httpClient.post(AppConstants.API_URL + 'flujo_client_updatepasswordcreateuser', formModel)
      .subscribe(
      data => {
        this.changePasswordForm.reset();
        this.alertService.info('Password was changed succesfully');
        this.spinnerService.hide();
      },
      error => {
        this.spinnerService.hide();
        this.alertService.danger('Password was not changed');
      });
  }
}
