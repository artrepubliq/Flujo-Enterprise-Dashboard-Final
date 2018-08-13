import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../../app.constants';
import { ICommonInterface } from '../../model/commonInterface.model';
import { IdomainDeploymentResponse } from '../model/Domian.Model';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AlertService } from 'ngx-alerts';

@Component({
  selector: 'app-domain-deployments',
  templateUrl: './domain-deployments.component.html',
  styleUrls: ['./domain-deployments.component.scss']
})
export class DomainDeploymentsComponent implements OnInit {
  public domainDetailsArray: IdomainDeploymentResponse[];

  constructor(
    private httpClient: HttpClient,
    private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    this.spinnerService.show();
    this.httpClient.get<ICommonInterface>(
      `${AppConstants.DOMAINS_API_URL}deployments/clientdeployments/${AppConstants.CLIENT_ID}`).subscribe(
        result => {
          this.spinnerService.hide();
          if (!result.error && result.custom_status_code === 100) {
            this.domainDetailsArray = result.result;
          } else if (result.custom_status_code === 160) {
            this.alertService.danger('Internal server Error');
          }  else {
            this.alertService.warning('Something went Wrong!');
          }
        },
        error => {
          console.log(error);
        }
      );
  }

}
