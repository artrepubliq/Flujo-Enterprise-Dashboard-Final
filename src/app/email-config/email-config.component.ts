import { Component, OnInit } from '@angular/core';
import { EmailConfigService } from '../service/email-config.service';

@Component({
  selector: 'app-email-config',
  templateUrl: './email-config.component.html',
  styleUrls: ['./email-config.component.scss']
})
export class EmailConfigComponent implements OnInit {

  constructor(
    private emailService: EmailConfigService
  ) {

  }

  ngOnInit() {
    /**
     * this is to add smtp user details to pass onto the children
     * component
     */
    this.emailService.getMailgunSmtpDetails().subscribe(
      result => {
        if (result.error === false) {
          this.emailService.addSmtpUserDetails(result);
        }
      },
      error => {
        console.log(error);
      });
  }

}
