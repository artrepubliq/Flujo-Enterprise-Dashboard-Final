import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmailConfigService } from '../../../service/email-config.service';
import { EmailConfigComponent } from '../../../email-config/email-config.component';
import { Subject } from '../../../../../node_modules/rxjs/Subject';

@Component({
  selector: 'app-create-domain-email',
  templateUrl: './create-domain-email.component.html',
  styleUrls: ['./create-domain-email.component.scss']
})
export class CreateDomainEmailComponent implements OnInit, OnDestroy {

  public domainForm: FormGroup;
  public ngUnSubScribe: Subject<any>;
  public domaindetails: boolean;
  public showProgressBar: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private emailService: EmailConfigService,
    private emailCnfgComponent: EmailConfigComponent
  ) {
    this.domainForm = this.formBuilder.group({
      'domain_name': ['', Validators.required]
    });
    this.ngUnSubScribe = new Subject<any>();
  }

  ngOnInit() {
    this.emailService.getSmtpUserDetails().takeUntil(this.ngUnSubScribe).subscribe(
      result => {
        if (result.error === false && result.data.length > 0) {
          this.domainForm.controls['domain_name'].setValue(result.data[0].domain_name);
          this.domaindetails = true;
          this.showProgressBar = false;
        }
      },
      error => {
        this.showProgressBar = false;
        console.log(error);
      });
  }

  public onSubmit(): void {
    this.showProgressBar = true;
    this.emailService.createDomainThirdparty(this.domainForm.value).subscribe(
      result => {
        this.showProgressBar = false;
        console.log(result);
        if (result.error === false) {
          this.emailCnfgComponent.ngOnInit();
        }
      },
      error => {
        console.log(error);
      }
    );
  }
  ngOnDestroy(): void {
    this.ngUnSubScribe.complete();
  }


}
