import { Component, OnInit } from '@angular/core';
import { EmailConfigService } from '../../../service/email-config.service';
import { ICampaignListDetails, ICampaignDetails } from '../../../model/email.config.model';

@Component({
  selector: 'app-create-mail-list',
  templateUrl: './add-user-list.component.html',
  styleUrls: ['./add-user-list.component.scss']
})
export class AddUserListComponent implements OnInit {

  public campaignList: ICampaignDetails[];
  public campaignListDetails: ICampaignListDetails[];
  constructor(
    private emailService: EmailConfigService
  ) { }

  ngOnInit() {
    this.getCampaignList();
  }
  /**
   * this is to get email campains from db
   */
  public getCampaignList(): void {

    this.emailService.getCampainDetailsOfClient().subscribe(
      result => {
        this.campaignList = result.data;
        this.campaignListDetails = this.campaignList.map(item => JSON.parse(item.campaign_details));
        console.log(this.campaignListDetails);
      },
      error => {
        console.log(error);
      }
    );

  }

}
