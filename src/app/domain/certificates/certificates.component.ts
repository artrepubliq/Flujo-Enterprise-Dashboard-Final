import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../../app.constants';
import { ICommonInterface } from '../../model/commonInterface.model';
import { ICertificates } from '../model/Domian.Model';

@Component({
  selector: 'app-certificates',
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.scss']
})
export class CertificatesComponent implements OnInit {
  public certificates_array: ICertificates[];

  constructor(
    private httpClient: HttpClient
  ) { }

  ngOnInit() {
    /**
     * this is to get list of certificates
     */
    this.httpClient.get<ICommonInterface>(`${AppConstants.DOMAINS_API_URL}certificates/listall/${AppConstants.CLIENT_ID}`).subscribe(
      result => {
        if (!result.error && result.custom_status_code === 100) {
          this.certificates_array = result.result;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

}
