import { Component, OnInit, OnDestroy } from '@angular/core';
import { EmailConfigService } from '../../../service/email-config.service';
import { json } from 'body-parser';
import { Subject } from 'rxjs/Subject';
import { IDomainDetails, IDnsRecords, IDomain } from '../../../model/email.config.model';
import { EmailConfigComponent } from '../../../email-config/email-config.component';

@Component({
  selector: 'app-domain-details',
  templateUrl: './domain-details.component.html',
  styleUrls: ['./domain-details.component.scss']
})
export class DomainDetailsComponent implements OnInit, OnDestroy {

  public sending_dns_records: IDnsRecords;
  public receiving_dns_records: IDnsRecords;
  public domain: IDomain;
  // public ngUnSubScribe = new Subject();
  public ngUnSubScribe: Subject<any>;
  public id: string;
  public client_id: string;

  constructor(
    private emailService: EmailConfigService,
    private emailCnfgComponent: EmailConfigComponent
  ) {
    this.ngUnSubScribe = new Subject<any>();
  }

  ngOnInit() {
    this.emailService.getSmtpUserDetails().takeUntil(this.ngUnSubScribe).subscribe(
      result => {
        if (result.error === false) {
          this.id = result.data[0].id;
          this.client_id = result.data[0].client_id;
          this.domain = JSON.parse(result.data[0].domain);
          this.receiving_dns_records = JSON.parse(result.data[0].receiving_dns_records);
          this.sending_dns_records = JSON.parse(result.data[0].sending_dns_records);
          console.log(this.domain);
          console.log(this.receiving_dns_records);
          console.log(this.sending_dns_records);
        } else {
          this.id = undefined;
          this.domain = undefined;
          this.client_id = undefined;
          this.receiving_dns_records = undefined;
          this.sending_dns_records = undefined;
        }
      },
      error => {
        console.log(error);
      });
  }

  /**
   * this is to delete user domain details
   */
  public deleteDomain(): void {
    const userDomainDetails = { domain_name: this.domain.name, id: this.id, client_id: this.client_id };
    this.emailService.deleteDomain(userDomainDetails).subscribe(
      result => {
        if (result.error === false) {
          this.emailCnfgComponent.ngOnInit();
        }
        console.log(result);
      },
      error => {
        console.log(error);
      });
  }
  ngOnDestroy(): void {
    this.ngUnSubScribe.complete();
  }
}

