import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { EmailConfigService } from '../../../service/email-config.service';
import { ICampaignListDetails, ICampaignDetails } from '../../../model/email.config.model';
import { Subject } from 'rxjs/Subject';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PapaParseService } from 'ngx-papaparse';
import { AlertService } from 'ngx-alerts';
import { MatListAvatarCssMatStyler } from '@angular/material';

@Component({
  selector: 'app-create-mail-list',
  templateUrl: './add-user-list.component.html',
  styleUrls: ['./add-user-list.component.scss']
})
export class AddUserListComponent implements OnInit, OnDestroy {

  public campaignList: ICampaignDetails[];
  public campaignListDetails: ICampaignListDetails[];
  public ngUnSubScribe = new Subject();
  public fileUploadForm: FormGroup;
  private formData: FormData;
  public maxSize = 5;
  public errors = [];
  public EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
  public emailsArray: any[];
  public databases = [
    { name: 'Change Maker', database: 'changemaker' },
    { name: 'Feedback', database: 'feedback' },
    { name: 'Report Problem', database: 'reportproblem' }
  ];
  public showProgressBar: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private emailService: EmailConfigService,
    private papa: PapaParseService,
    private alertService: AlertService,
  ) {
    this.fileUploadForm = this.formBuilder.group({
      'members': [''],
      'campaign_address': ['', Validators.required],
      'database': ['']
    });
  }

  ngOnInit() {
    this.getCampaignList();
    this.emailService.getCampaignAddress().takeUntil(this.ngUnSubScribe).subscribe(
      result => {
        console.log(result);
        this.fileUploadForm.controls['campaign_address'].setValue(result);
      },
      error => {
        console.log(error);
      }
    );
  }
  /**
   * this is to get campaign details from the service
   */
  public getCampaignList(): void {
    this.showProgressBar = true;
    this.emailService.getCampaignDetails().takeUntil(this.ngUnSubScribe).subscribe(
      result => {
        this.showProgressBar = false;
        this.campaignListDetails = result;
        console.log(this.campaignListDetails);
      },
      error => {
        this.showProgressBar = false;
        console.log(error);
      }
    );
  }
  /**
   * @param event this takes the csv file event
   */
  public async onFileChange(event: any) {
    this.emailsArray = [];
    console.log(event.target.files[0]);

    // this.fileUploadForm.controls['file'].setValue(event.target.files[0]);
    this.validateFileSize(event.target.files[0]);

    const emailcsv = await this.getCsvData(event.target.files[0]);
    let arrayOfEmails = [];
    emailcsv.map((arrayItems) => {
      const filtereditems = arrayItems.filter(item => item.match(this.EMAIL_REGEXP) != null);
      if (filtereditems.length > 0) {
        arrayOfEmails = [...arrayOfEmails, ...filtereditems];
      }
    });
    this.fileUploadForm.controls['members'].setValue(arrayOfEmails.join());
  }

  /**
   * @param csvEmailData this takes cdv file to parse the csv file.
   */
  public getCsvData(csvEmailData): Promise<any> {
    return new Promise((resolve, reject) => {
      this.papa.parse(csvEmailData, {
        complete: (results) => {
          resolve(results.data);
        }
      });
    });
  }

  /**
   * @param file this takes file as input to validate file size
   */
  public validateFileSize(file: any): boolean {
    const fileSizeinMB = file.size / (1024 * 1000);
    const size = Math.round(fileSizeinMB * 100) / 100; // convert upto 2 decimal place
    if (size > this.maxSize) {

      this.alertService.warning('Error (File Size): ' + file.name + ': exceed file size limit of '
        + this.maxSize + 'MB ( ' + size + 'MB )');
      this.errors.push('Error (File Size): ' + file.name + ': exceed file size limit of '
        + this.maxSize + 'MB ( ' + size + 'MB )');
      console.log(this.errors);
      return false;
    } else {
      return true;
    }
  }
  /**
   * this is to sumbit the csv file with campaign email
   */
  public submitFile(): void {
    console.log(this.fileUploadForm.value);
    this.showProgressBar = true;
    this.emailService.addMembersToACampaign(this.fileUploadForm.value).subscribe(
      result => {
        this.showProgressBar = false;
        this.alertService.success(result.data);
        console.log(result);
      },
      error => {
        this.alertService.danger(error);
        this.showProgressBar = false;
        console.log(error);
      });
  }

  ngOnDestroy() {
    this.ngUnSubScribe.complete();
  }
}
