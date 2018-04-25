import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AccessDataModelComponent } from '../model/useraccess.data.model';
import { HttpClient } from '@angular/common/http';
import { IActiveHeader } from '../model/active-header.model';

@Component({
  selector: 'app-headerurls',
  templateUrl: './headerurls.component.html',
  styleUrls: ['./headerurls.component.scss']
})
export class HeaderurlsComponent implements OnInit {
  isActive: boolean;
  @Input() header: IActiveHeader;
  userAccessDataModel: AccessDataModelComponent;
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    public location: Location
  ) {
    this.userAccessDataModel = new AccessDataModelComponent(this.httpClient, this.router);
  }

  ngOnInit() {
    // console.log(this.header);
  }

  radioChange = (segment, feature_id) => {
    const accessLevel = this.userAccessDataModel.userAccessLevels;
    this.userAccessDataModel.setUserAccessLevels(accessLevel, feature_id, 'admin/' + segment);
    this.router.navigate(['/admin/' + segment]);
  }
}
