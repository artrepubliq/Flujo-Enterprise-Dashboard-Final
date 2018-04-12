import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailThemeConfig, IPostEmailTemplate } from '../model/emailThemeConfig.model';
import { FormBuilder, Validators } from '@angular/forms';
import { AccessDataModelComponent } from '../model/useraccess.data.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-email-template',
  templateUrl: './email-template.component.html',
  styleUrls: ['./email-template.component.scss']
})
export class EmailTemplateComponent implements OnInit {
  public data: EmailThemeConfig;
  public createEmailTemplateForm: any;
  public template_html: any;
  userAccessDataModel: AccessDataModelComponent;
  feature_id = 28;
  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private router: Router
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
    if (Number(localStorage.getItem('feature_id')) !== this.feature_id) {
      this.userAccessDataModel = new AccessDataModelComponent(httpClient, router);
      this.userAccessDataModel.setUserAccessLevels(null, this.feature_id, 'admin/emailconfiguration');
    }
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
