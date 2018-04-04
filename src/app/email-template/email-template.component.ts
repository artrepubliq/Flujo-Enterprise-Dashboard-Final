import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmailThemeConfig, IPostEmailTemplate } from '../model/emailThemeConfig.model';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-email-template',
  templateUrl: './email-template.component.html',
  styleUrls: ['./email-template.component.scss']
})
export class EmailTemplateComponent implements OnInit {
  public data: EmailThemeConfig;
  public createEmailTemplateForm: any;
  public template_html: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
  ) {
    // client_id: string;
    // template_name: string;
    // template_category: string;
    // template_html: string;
    // emailtemplateconfig_id?: string;
    this.createEmailTemplateForm = this.formBuilder.group({
      'template_name': ['', Validators.required],
      'template_category': ['', Validators.required],
      'template_html': ['', Validators.required],
      'emailtemplateconfig_id': [''],
      'client_id': ['']
    });
    console.log(this.template_html);
    this.template_html = '<html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><title>A Simple Responsive HTML Email</title><style type="text/css">body {margin: 0; padding: 0; min-width: 100%!important;}.content {width: 100%; max-width: 600px;}  </style></head><body yahoo bgcolor="#f6f8f1"><table width="100%" bgcolor="#f6f8f1" border="0" cellpadding="0" cellspacing="0"><tr><td><table class="content" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td>Hello!</td></tr></table></td></tr></table></body></html>';
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((result => {
      console.log(result.themedata);
    }));
  }

  public submitTemplate(): void {
    this.createEmailTemplateForm.get('client_id').
    console.log(this.createEmailTemplateForm.value);
  }
  public modelChanged(event) {
    console.log(event);
    this.template_html = event;
  }

}
