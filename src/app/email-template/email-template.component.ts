import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailThemeConfig, IPostEmailTemplate } from '../model/emailThemeConfig.model';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { EmailTemplateService } from './email-template-service';
import { AlertService } from 'ngx-alerts';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AppConstants } from '../app.constants';
import * as _ from 'underscore';
import { startWith } from 'rxjs/operators/startWith';
import { Observable } from 'rxjs/Observable';
import {map} from 'rxjs/operators/map';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { EmailTemplateResolver } from './email-template.resolver'

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
  selector: 'app-email-template',
  templateUrl: './email-template.component.html',
  styleUrls: ['./email-template.component.scss']
})
export class EmailTemplateComponent implements OnInit {
  tempate_categories: string[];
  dummy: any;
  template_html1: SafeHtml;
  isView = true;
  isEdit = false;
  filteredThemes: EmailThemeConfig[];
  uniqueEmailTemplates: EmailThemeConfig[];
  allEmailTemplates: EmailThemeConfig[];
  allEmailTemplates2: EmailThemeConfig[];
  public editOrUpdate: boolean;
  public data: EmailThemeConfig;
  public createEmailTemplateForm: any;
  templateCategory: FormControl = new FormControl();
  filteredOptions: Observable<string[]>;
  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private emailTemplateService: EmailTemplateService,
    private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertService,
    private router: Router,
  ) {
    this.createEmailTemplateForm = this.formBuilder.group({
      'template_name': ['', Validators.required],
      'template_category': [''],
      'template_html': [''],
      'emailtemplateconfig_id': [''],
      'client_id': ['']
    });
    this.tempate_categories = [''];
    // console.log(this.template_html);

  }

  ngOnInit() {
    this.activatedRoute.data.subscribe(result => {
      console.log(result.themedata);
      this.spinnerService.hide();
      this.editOrUpdate = false;
      this.allEmailTemplates = result.themedata;
      this.allEmailTemplates2 = result.themedata;
      console.log(this.allEmailTemplates);
      this.uniqueEmailTemplates = _.uniq(result.themedata, function (x) {
        return x.template_category;
      });
      this.uniqueEmailTemplates.map((themeObject) => {
        this.tempate_categories.push(themeObject.template_category);
        this.getFilteredEmailCategories();
      });
      console.log(this.tempate_categories);
      this.filteredThemes = [];
      console.log(this.uniqueEmailTemplates);
    },
      error => {
        console.log(error);
      });
  }

  public submitTemplate() {
    // this.createEmailTemplateForm.get('client_id').
    if (this.dummy) {
      this.createEmailTemplateForm.controls['emailtemplateconfig_id'].setValue(this.dummy.id);
    }
    if (this.templateCategory.value === '') {
      return false;
    }
    this.createEmailTemplateForm.controls['template_category'].setValue(this.templateCategory.value);
    this.createEmailTemplateForm.controls['client_id'].setValue(AppConstants.CLIENT_ID);
    const formModel = this.createEmailTemplateForm.value;
    this.spinnerService.show();
    this.emailTemplateService.postEmailTemplateData(formModel, 'flujo_client_postemailtemplateconfig')
      .subscribe((result) => {
        console.log(result);
        if (result.error) {
          this.alertService.warning(result.result);
          // console.log(data);
          this.spinnerService.hide();
        } else {
          this.alertService.success('Template saved successfully');
          this.spinnerService.hide();
          this.createEmailTemplateForm.reset();
          this.router.navigateByUrl('/admin/emailconfiguration', { skipLocationChange: true });
          this.router.navigate(['/admin/emailconfiguration']);

        }
      },
        error => {
          console.log(error);
        }
      );
  }

  public getEmailTemplateData(): void {

  }
  public getFilteredEmailCategories() {
    // this.filteredOptions = this.templateCategory.valueChanges.pipe(
    //   startWith(''),
    //   map(val => this.filter(val))
    // );
    this.filteredOptions = this.templateCategory.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filter(val))
      );
  }

  public filter(val: string): string[] {
    return this.tempate_categories.filter(option => option.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }
  // public modelChanged(event): void {
  //   console.log(event.target.value);
  //   this.template_html = event.target.value;
  //   this.createEmailTemplateForm.controls['template_html'].setValue(this.template_html);
  // }
  deleteEmailTemplate = (emailtemplateconfig_id) => {
    this.emailTemplateService.deleteEmailTemplateData(AppConstants.API_URL,
      'flujo_client_deleteemailtemplateconfig/', emailtemplateconfig_id)
      .subscribe((result) => {
        console.log(result);
        if (result.error) {
          this.alertService.warning(result.result);
          // console.log(data);
          this.spinnerService.hide();
        } else {
          this.alertService.success('Template delete successfully');
          this.spinnerService.hide();
          this.readTemplates(this.filteredThemes);
        }
      },
        error => {
          console.log(error);
        }
      );
  }
  public readTemplates(theme_category): void {
    // this.allEmailTemplates2 = this.allEmailTemplates;
    console.log(theme_category);
    this.filteredThemes = this.allEmailTemplates2.filter((filterTemplate) => filterTemplate.template_category === theme_category);
    console.log(this.filteredThemes);
  }
  setDefaultEmailTemplateDetails(emailTemplateItem) {
    if (emailTemplateItem) {
      this.createEmailTemplateForm.controls['template_name'].setValue(emailTemplateItem.template_name);
      this.createEmailTemplateForm.controls['template_category'].setValue(emailTemplateItem.template_category);
      this.createEmailTemplateForm.controls['template_html'].setValue(this.template_html1);
      this.createEmailTemplateForm.controls['emailtemplateconfig_id'].setValue(emailTemplateItem.id);
      console.log(this.createEmailTemplateForm.value);
    }
  }
  addEmailTemplate = () => {
    this.isEdit = true;
    this.createEmailTemplateForm.reset();
    this.isView = false;
    this.template_html1 = '';
  }
  editEmailTemplate = (emailTemplateData) => {
    this.template_html1 = emailTemplateData.template_html;
    this.dummy = emailTemplateData;
    this.isEdit = true;
    this.isView = false;
    this.setDefaultEmailTemplateDetails(emailTemplateData);
  }
  cancelEditTemplate() {
    this.isEdit = false;
  }


}
