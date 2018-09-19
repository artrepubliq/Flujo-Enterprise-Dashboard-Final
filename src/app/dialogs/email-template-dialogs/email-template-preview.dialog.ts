import { Component, Inject, Pipe, PipeTransform } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
@Pipe({
    name: 'safeHtml'
  })
  export class SafeHtmlPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) { }
    transform(html) {
      return this.sanitizer.bypassSecurityTrustHtml(html);
    }
  }
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'dialog-overview-example-dialog',
    templateUrl: 'email-template-preview-dialog.html',
    styleUrls: ['email-template-preview-dialog.scss']
})
// tslint:disable-next-line:component-class-suffix
export class EmailTemplatePreviewDialog {

    constructor(
        public dialogRef: MatDialogRef<EmailTemplatePreviewDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
