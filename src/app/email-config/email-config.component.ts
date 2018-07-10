import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { EmailConfigService } from '../service/email-config.service';
import { MatTabChangeEvent } from '@angular/material';

@Component({
  selector: 'app-email-config',
  templateUrl: './email-config.component.html',
  styleUrls: ['./email-config.component.scss']
})

export class EmailConfigComponent implements OnInit, AfterViewInit {

  @ViewChild('tabGroup') tabGroup;

  public createDomain: boolean;
  public selectedIndex: number;
  // public tabindex: number;
  public currentTab: number;

  constructor(
    private emailService: EmailConfigService
  ) { }

  ngOnInit() {
    /**
     * this is to add smtp user details to pass onto the children
     * component
     */
    this.emailService.getMailgunSmtpDetails().subscribe(
      result => {
        if (result.error === false && result.data && result.data.length > 0) {
          this.createDomain = false;
          this.emailService.addSmtpUserDetails(result);
        }
      },
      error => {
        console.log(error);
      });

    /**
     * this is to get Campaign details from Database
     */
    this.emailService.getCampainDetailsOfClient().subscribe(
      result => {
        if (result.error === false && result.data && result.data.length > 0) {
          const campaignList = result.data;
          console.log(campaignList);
          // const campaignListDetails = campaignList.map(item => JSON.parse(item.campaign_details));
          this.emailService.addCampaignDetails(campaignList);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  /**
   * @param event mat tab change event triggered when the tab are being switched
   */
  public onTabChange(event: MatTabChangeEvent): void {
    this.currentTab = event.index;
  }

  /**
   * @param event this is the tab number.
   * this function invoked when the campaign is being create
   */
  public tabChanged(event: number): void {
    this.selectedIndex = this.currentTab + event;
  }

  ngAfterViewInit() {
    this.currentTab = this.tabGroup.selectedIndex;
  }
}

