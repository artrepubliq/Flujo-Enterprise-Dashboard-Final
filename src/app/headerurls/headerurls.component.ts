import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-headerurls',
  templateUrl: './headerurls.component.html',
  styleUrls: ['./headerurls.component.scss']
})
export class HeaderurlsComponent implements OnInit {

  constructor(
    private router: Router,
    public location: Location
  ) {

   }

  ngOnInit() {
  }

  radioChange = (segment) => {
    console.log(this.router.url);
    console.log(this.location);
    this.router.navigate(['/admin/' + segment]);
  }
}
