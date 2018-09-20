import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
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
