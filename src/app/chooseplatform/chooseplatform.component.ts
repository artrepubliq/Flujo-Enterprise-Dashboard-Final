import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AccessDataModelComponent } from '../model/useraccess.data.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chooseplatform',
  templateUrl: './chooseplatform.component.html',
  styleUrls: ['./chooseplatform.component.scss']
})
export class ChooseplatformComponent implements OnInit {
  userAccessDataModel: AccessDataModelComponent;
  feature_id: number;
  constructor(private router: Router, private httpClient: HttpClient) {
    this.feature_id = 1;
    if (Number(localStorage.getItem('feature_id')) !== this.feature_id) {
      this.userAccessDataModel = new AccessDataModelComponent(httpClient, router);
      this.userAccessDataModel.setUserAccessLevels(null , this.feature_id, 'admin/chooseplatform');
    }
  }

  ngOnInit() {
    setTimeout(function() {
      // this.spinnerService.hide();
    }.bind(this), 3000);
  }

  routing () {
    this.userAccessDataModel = new AccessDataModelComponent(this.httpClient, this.router);
    this.userAccessDataModel.setUserAccessLevels(null, this.feature_id, 'admin/pages');
  }
}
