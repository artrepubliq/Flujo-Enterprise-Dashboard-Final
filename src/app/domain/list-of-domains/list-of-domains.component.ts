    import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../../app.constants';
import { IDomainsList, IDNSResponse, IRegisteredDomains } from '../model/Domian.Model';
import { EmailConfigService } from '../../service/email-config.service';
import { ICommonInterface } from '../../model/commonInterface.model';
import { AlertService } from 'ngx-alerts';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/forkJoin';
import { DomainsService } from '../services/domains.service';
@Component({
  selector: 'app-list-of-domains',
  templateUrl: './list-of-domains.component.html',
  styleUrls: ['./list-of-domains.component.scss']
})
export class ListOfDomainsComponent implements OnInit {
  public registerdDomains: IRegisteredDomains[] = [];
  public arrayDomainsList: IDomainsList[];
  expand: boolean;
  ArrayDomains: any;
  public dnsArray: IDNSResponse[];
  showRecords: boolean;
  constructor(
    private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertService,
    private emailService: EmailConfigService,
    private httpClient: HttpClient,
    private domainsService: DomainsService
  ) {
    this.expand = false;
  }

  ngOnInit() {
    this.spinnerService.show();
    Observable.combineLatest(
      this.domainsService.getListOfDomains(AppConstants.CLIENT_ID),
      this.emailService.getRegisteredMailgunDomains(AppConstants.CLIENT_ID)
    ).subscribe(combinedResult => {
      this.spinnerService.hide();
      if (!combinedResult[0].error && !combinedResult[1].error) {
        console.log(combinedResult);
        this.arrayDomainsList = combinedResult[0].result;
        this.arrayDomainsList.map(item => {
          item.dnsDetails = [];
          item.dnsDetailsDisplayed = false;
          if (item.domain_name.includes('www.')) {
            item.domain_name.replace('www.', '');
          } else if (item.domain_name.includes('http://www.')) {
            item.domain_name.replace('http://www.', '');
          } else if (item.domain_name.includes('http://www')) {
            item.domain_name.replace('http://www', '');
          }
        });
        // console.log(this.arrayDomainsList);
        this.registerdDomains = combinedResult[1].data;
        this.arrayDomainsList.map((domains, index) => {
          this.registerdDomains.map(regDomain => {
            if (regDomain.domain_name === domains.domain_name) {
              domains.registered = true;
            } else {
              domains.registered = false;
            }
          });
        });
      } else {
        this.spinnerService.hide();
        this.alertService.danger('Something went wrong!');
      }
    }, error => {
      this.spinnerService.hide();
      console.log(error);
    });
  }
  // LIST OF ALL DOMAINS GETTING FROM ZEIT SERVER
  getlistOfAllDomains = () => {
    this.httpClient.get<ICommonInterface>(`${AppConstants.DOMAINS_API_URL}domains/${AppConstants.CLIENT_ID}`)
      .subscribe(
        successResp => {
          console.log(successResp);
          if (!successResp.error) {
            this.arrayDomainsList = successResp.result[0].domains;
            this.arrayDomainsList.map(item => {
              item.dnsDetails = [];
              item.dnsDetailsDisplayed = false;
            });
          }
          // this.DomainsList = this.ArrayDomains.domains;
          // console.log(this.DomainsList);
        },
        errorResp => {
          console.log(errorResp);
        }
      );
  }

  // this is to get list of registerd domains
  getListOfRegisteredMailgunDomains = () => {
    this.emailService.getRegisteredMailgunDomains(AppConstants.CLIENT_ID).subscribe(
      result => {
        if (!result.error) {
          this.registerdDomains = result.data;
        }
      },
      error => {
        console.log(error);
      }
    );
  }
  // SETUP BULK EMAIL CONFIGURATION FOR ZEIT.COM DOMAINS.
  setUpBulkEmailConfig = (domainItem: IDomainsList, index: number) => {
    // console.log(domainItem);
    // console.log(index);
    this.spinnerService.show();
    const domainObject = { domain_name: `${domainItem.domain_name}` };
    this.emailService.createDomain(domainObject).subscribe(
      result => {
        if (result.error === false) {
          this.spinnerService.hide();
          this.alertService.info(result.data);
          this.arrayDomainsList[index].registered = true;
        } else {
          this.spinnerService.hide();
          this.alertService.danger('something went wrong!');
        }
      },
      error => {
        this.spinnerService.hide();
        console.log(error);
      }
    );
  }

  // Get DNS records by domain name
  getDnsRecords = (domianObject: IDomainsList, index: number) => {
    const options = {
      client_id: AppConstants.CLIENT_ID,
      domain_name: domianObject.domain_name
    };
    if (this.arrayDomainsList[index].dnsDetails.length === 0) {
      this.httpClient.post<ICommonInterface>(`${AppConstants.DOMAINS_API_URL}dns/dnsrecordsbydomain/list`, options).subscribe(
        result => {
          if (!result.error && result.custom_status_code === 100) {
            this.arrayDomainsList[index].dnsDetails = result.result;
            this.arrayDomainsList[index].dnsDetailsDisplayed = true;
            console.log(this.arrayDomainsList);
          } else if (result.custom_status_code === 160) {
            this.alertService.danger('Internal server Error');
          } else {
            this.alertService.danger('Something went Wrong');
          }
        },
        error => {
          console.log(error);
        });
    } else {
      this.arrayDomainsList[index].dnsDetailsDisplayed = true;
    }
  }

  showDomainList = (index) => {
    this.arrayDomainsList[index].dnsDetailsDisplayed = false;
  }

}
