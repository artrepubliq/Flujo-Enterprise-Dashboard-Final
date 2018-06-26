import { Component, OnInit, OnDestroy } from '@angular/core';
import { EmailConfigService } from '../../../service/email-config.service';
import { json } from 'body-parser';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-domain-details',
  templateUrl: './domain-details.component.html',
  styleUrls: ['./domain-details.component.scss']
})
export class DomainDetailsComponent implements OnInit, OnDestroy {

  sending_dns_records: any;
  receiving_dns_records: any;
  domain: any;
  public ngUnSubScribe = new Subject();

  constructor(
    private emailService: EmailConfigService
  ) { }

  ngOnInit() {
    this.emailService.getSmtpUserDetails().takeUntil(this.ngUnSubScribe).subscribe(
      result => {
        console.log(result);
        this.domain = JSON.parse(result.data[0].domain);
        this.receiving_dns_records = JSON.parse(result.data[0].receiving_dns_records);
        this.sending_dns_records = JSON.parse(result.data[0].sending_dns_records);
        console.log(this.domain);
        console.log(this.receiving_dns_records);
        console.log(this.sending_dns_records);
      },
      error => {
        console.log(error);
      });
  }

  ngOnDestroy(): void {
    this.ngUnSubScribe.complete();
  }
}

