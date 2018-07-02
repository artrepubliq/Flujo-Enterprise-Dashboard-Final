import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { EmailConfigService } from '../../../service/email-config.service';
import { IDomain, ICampaignDetails, ICampaignListDetails } from '../../../model/email.config.model';
import { Subject } from 'rxjs/Subject';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource, MatSort, MatPaginator, SortDirection } from '@angular/material';

@Component({
  selector: 'app-mailing-list',
  templateUrl: './mailing-list.component.html',
  styleUrls: ['./mailing-list.component.scss']
})

export class MailingListComponent implements OnInit, OnDestroy {

  public unSubscribe = new Subject();
  public smtpDetails: IDomain;
  public domain_name: string;
  public mailingListForm: FormGroup;
  public campaignList: ICampaignDetails[];
  public campaignListDetails: ICampaignListDetails[];

  @Output() tabIndex: EventEmitter<number> = new EventEmitter<number>();


  constructor(
    private emailService: EmailConfigService,
    public formBuilder: FormBuilder
  ) {
    this.mailingListForm = this.formBuilder.group({
      'name': ['', Validators.required],
      'address': ['', Validators.required],
      'description': ['', Validators.required]
    });
  }

  ngOnInit() {

    this.emailService.getSmtpUserDetails().takeUntil(this.unSubscribe).subscribe(
      result => {
        if (result.error === false) {
          this.smtpDetails = JSON.parse(result.data[0].domain);
          console.log(this.smtpDetails);
          this.domain_name = '@' + this.smtpDetails.name;
        } else {
          this.smtpDetails = undefined;
        }
      },
      error => {
        console.log(error);
      });

    // this.getCampaignList();
  }

  /**
   * this is to submit a new campaign
   */
  public onSubmit(): void {
    this.mailingListForm.controls['address'].setValue(this.mailingListForm.controls['address'].value + '@' + this.domain_name);
    console.log(this.mailingListForm.value);
    this.emailService.createCampaign(this.mailingListForm.value).subscribe(
      result => {
        this.mailingListForm.reset();
        console.log(result);
        this.tabIndex.emit(1);
      },
      error => {
        console.log(error);
      }
    );
  }


  public tabChanged(event) {
    console.log(event);
  }

  ngOnDestroy() {
    this.unSubscribe.complete();
  }

}

