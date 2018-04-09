import { Component, OnInit } from '@angular/core';
import { AdminComponent } from '../admin/admin.component';
import { Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import * as _ from 'underscore';
@Component({
  selector: 'app-tnc',
  templateUrl: './tnc.component.html',
  styleUrls: ['./tnc.component.scss']
})
export class TncComponent implements OnInit {

  filteredUserAccessData: any;
  userAccessLevelObject: any;
  constructor(public adminComponent: AdminComponent, private router: Router, private spinnerService: Ng4LoadingSpinnerService) {
   }

  ngOnInit() {
  }

}
