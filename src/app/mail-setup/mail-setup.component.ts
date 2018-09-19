import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmailConfigService } from '../service/email-config.service';
import { BASE_ROUTER_CONFIG } from '../app.router-contstants';

@Component({
  selector: 'app-mail-setup',
  templateUrl: './mail-setup.component.html',
  styleUrls: ['./mail-setup.component.scss']
})
export class MailSetupComponent implements OnInit {
  emails: { id: number; name: string; email_config: string; }[];


  constructor(private router: Router,
    private emailService: EmailConfigService,
  ) {
    this.emails = [
      { id: 1, name: 'Bulk email configuration', email_config: BASE_ROUTER_CONFIG.F_4_SF_1.token },
      { id: 2, name: 'Send Emails', email_config: BASE_ROUTER_CONFIG.F_4_SF_3.token }
    ];
  }

  navigateToSocial = (email_of_type) => {
    this.router.navigate([`admin/${email_of_type}`]);
  }

  ngOnInit() {
  }

}
