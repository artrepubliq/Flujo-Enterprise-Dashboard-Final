import { Component, OnInit, OnDestroy } from '@angular/core';
import { EmailConfigService } from '../../../service/email-config.service';
import { Subject } from 'rxjs/Subject';
import { IDomain } from '../../../model/email.config.model';

@Component({
  selector: 'app-smtp-details',
  templateUrl: './smtp-details.component.html',
  styleUrls: ['./smtp-details.component.scss']
})
export class SmtpDetailsComponent implements OnInit, OnDestroy {
  public unSubscribe = new Subject();
  smtpDetails: IDomain;

  constructor(
    private emailService: EmailConfigService
  ) { }

  ngOnInit() {
    this.emailService.getSmtpUserDetails().takeUntil(this.unSubscribe).subscribe(
      result => {
        if (result.error === false) {
          this.smtpDetails = JSON.parse(result.data[0].domain);
          // console.log(this.smtpDetails);
        }
      },
      error => {
        console.log(error);
      });
  }

  ngOnDestroy() {
    this.unSubscribe.complete();
  }

}
