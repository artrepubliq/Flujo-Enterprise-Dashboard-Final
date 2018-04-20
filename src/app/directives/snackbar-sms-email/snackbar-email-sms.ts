import { Component, Inject } from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material';
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'your-snack-bar',
    templateUrl: 'sms-email-contacts.html',
  })
  export class MessageArchivedComponent {
    constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any, public snackBar: MatSnackBar) { }
    close() {
      this.snackBar.dismiss();
    }
  }
