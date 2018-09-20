import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
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
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    public location: Location
  ) {
  }

  ngOnInit() {
    console.log(this.header);
  }

  radioChange = (segment, feature_id) => {
    this.router.navigate(['/admin/' + segment]);
  }
}
