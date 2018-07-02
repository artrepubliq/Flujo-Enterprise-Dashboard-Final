import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-social-login',
  templateUrl: './social-login.component.html',
  styleUrls: ['./social-login.component.scss']
})
export class SocialLoginComponent implements OnInit {
  social: any;
  constructor( private router: Router) {
    this.social = [
      { id: 0, social_name: 'Facebook' },
      { id: 1, social_name: 'Twitter' },
      { id: 2, social_name: 'Yotube' },
      { id: 3, social_name: 'Instalgram' },

    ];
   }

  ngOnInit() {
  }
  navigateToSocial = (item) => {
    this.router.navigate(['admin/social_management', item.id]);
  }
}
