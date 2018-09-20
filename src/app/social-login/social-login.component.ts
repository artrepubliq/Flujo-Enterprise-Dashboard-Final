import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BASE_ROUTER_CONFIG } from '../app.router-contstants';

@Component({
  selector: 'app-social-login',
  templateUrl: './social-login.component.html',
  styleUrls: ['./social-login.component.scss']
})
export class SocialLoginComponent implements OnInit {
  selectedIndex: any;
  social: any;
  isShowSocialManagement = false;
  constructor( private router: Router) {
    this.social = [
      { id: 0, social_name: 'Facebook' },
      { id: 1, social_name: 'Twitter' },
      { id: 2, social_name: 'Yotube' },
      { id: 3, social_name: 'Instalgram' },

    ];
   }

  ngOnInit() {
    const prevTabIndex = localStorage.getItem('social_tabindex');
    if (prevTabIndex.length > 0) {
      this.selectedIndex = Number(prevTabIndex);
      this.isShowSocialManagement = true;
    }
  }
  navigateToSocial = (item) => {
    this.isShowSocialManagement = true;
    this.selectedIndex = item.id;
    // this.router.navigate(['admin/' + BASE_ROUTER_CONFIG.F_3_SF_1.token, item.id]);
  }
}
