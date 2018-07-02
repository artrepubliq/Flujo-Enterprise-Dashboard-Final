import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmailConfigService } from '../../../service/email-config.service';
import { EmailConfigComponent } from '../../../email-config/email-config.component';

@Component({
  selector: 'app-create-domain-email',
  templateUrl: './create-domain-email.component.html',
  styleUrls: ['./create-domain-email.component.scss']
})
export class CreateDomainEmailComponent implements OnInit {

  public domainForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private emailService: EmailConfigService,
    private emailCnfgComponent: EmailConfigComponent
  ) {
    this.domainForm = this.formBuilder.group({
      'domain_name': ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  public onSubmit(): void {
    this.emailService.createDomain(this.domainForm.value).subscribe(
      result => {
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


}
