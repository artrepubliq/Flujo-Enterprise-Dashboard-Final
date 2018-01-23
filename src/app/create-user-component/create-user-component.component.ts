import { Component, OnInit } from '@angular/core';
// import { User }    from '../user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-user-component',
  templateUrl: './create-user-component.component.html',
  styleUrls: ['./create-user-component.component.scss']
})
export class CreateUserComponentComponent implements OnInit {
  CreateUserForm: any;

  // model=new User(1,'','','','');

  PHONE_REGEXP = /^([0]|\+91)?[789]\d{9}$/;
  EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;

  submitted = false;

  onSubmit() { this.submitted = true; }

  constructor(private formBuilder: FormBuilder) { 
    this.CreateUserForm = this.formBuilder.group({
      'name': ['', Validators.required],
      'email': ['', Validators.compose([Validators.required,Validators.pattern(this.EMAIL_REGEXP)])],
      'phone': ['', Validators.compose([Validators.required, Validators.pattern(this.PHONE_REGEXP)])],
      'role': ['', Validators.required]
      });
  }

  ngOnInit() {
  }

  showFormControls(form: any) {
    return form && form.controls['name'] &&
    form.controls['name'].value; // Dr. IQ
  }

}
