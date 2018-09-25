import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent, MatDialog } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { ICommonInterface } from '../model/commonInterface.model';
import { AppConstants } from '../app.constants';
import { EmailTemplatePreviewDialog } from '../dialogs/email-template-dialogs/email-template-preview.dialog';
import { Router } from '@angular/router';
import { BASE_ROUTER_CONFIG } from "../app.router-contstants";

@Component({
  selector: 'app-default-email-templates',
  templateUrl: './default-email-templates.component.html',
  styleUrls: ['./default-email-templates.component.scss']
})
export class DefaultEmailTemplatesComponent implements OnInit {
  currentTab: number;
  selectedIndex = 0;
  emailTemplateData: ICommonInterface;
  isEmailBuilder: boolean;
  editEmailTemplateData: ICommonInterface;

  constructor(private httpClient: HttpClient,
    private router: Router,
    public dialog: MatDialog) { }

  ngOnInit() {

  }
  public onTabChange(event: MatTabChangeEvent): void {
    this.currentTab = event.index;
  }

  // GOTO EMAIL BUILDER
  gotoEmailBulder = () => {
    this.router.navigate(['admin/' + BASE_ROUTER_CONFIG.F_4_SF_4.token]);
    localStorage.setItem('activeRouterToken', BASE_ROUTER_CONFIG.F_4_SF_4.token);
    localStorage.setItem('activeRouterId', 'F_4_' + BASE_ROUTER_CONFIG.F_4_SF_4.id);
  }
  getEmailTemplateData = (emailTemplateId) => {
    this.httpClient.get<ICommonInterface>(AppConstants.API_URL + 'flujo_client_emailtemplates/' + emailTemplateId)
      .subscribe(
        data => {
          this.emailTemplateData = data;
          this.openDialog();
        }, err => {
          console.log(err);
        }
      );
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(EmailTemplatePreviewDialog, {
      width: '1000px',
      height: '60vh',
      data: this.emailTemplateData
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  editEmailTemplate = (editEmailTemplateId) => {
    this.httpClient.get<ICommonInterface>(AppConstants.API_URL + 'flujo_client_emailtemplates/' + editEmailTemplateId)
      .subscribe(
        data => {
          this.editEmailTemplateData = data;
          this.isEmailBuilder = true;
        }, err => {
          console.log(err);
        }
      );
  }

  showParent = (event) => {
    console.log(event);
    this.isEmailBuilder = false;
  }
}
