import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IPostEmailTemplate } from '../model/emailThemeConfig.model';
import { AccessDataModelComponent } from '../model/useraccess.data.model';
import { HttpClient } from '@angular/common/http';
// import { IPostEmailTemplate, EmailThemeConfig } from '../model/emailThemeConfig.model';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { EmailTemplateService } from './email-template-service';
import { AlertService } from 'ngx-alerts';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AppConstants } from '../app.constants';
import * as _ from 'underscore';
import { startWith } from 'rxjs/operators/startWith';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { EmailTemplateResolver } from './email-template.resolver';
import { CKEditorModule } from 'ngx-ckeditor';
import { PlatformLocation } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
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
  filteredOptions: Observable<string[]>;
  templateCategory: FormControl;
  img: any;
  test: any;
  config: any;
  tempate_categories: string[];
  dummy: any;
  template_html1: any;
  isView = true;
  isEdit = false;
  filteredThemes: IPostEmailTemplate[];
  uniqueEmailTemplates: IPostEmailTemplate[];
  allEmailTemplates: IPostEmailTemplate[];
  allEmailTemplates2: IPostEmailTemplate[];
  public editOrUpdate: boolean;
  public data: IPostEmailTemplate;
  public createEmailTemplateForm: any;
  public template_html: any;
  userAccessDataModel: AccessDataModelComponent;
  feature_id = 28;
  constructor(
    private httpClient: HttpClient,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private emailTemplateService: EmailTemplateService,
    private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute,
    private platformLocation: PlatformLocation,
  ) {

    this.createEmailTemplateForm = this.formBuilder.group({
      'template_name': ['', Validators.required],
      'template_category': [''],
      'template_html': ['', Validators.required],
      'emailtemplateconfig_id': [''],
      'client_id': ['']
    });
    this.templateCategory = new FormControl('', Validators.required);
    if (Number(localStorage.getItem('feature_id')) !== this.feature_id) {
      this.userAccessDataModel = new AccessDataModelComponent(httpClient, router);
      this.userAccessDataModel.setUserAccessLevels(null, this.feature_id, 'admin/emailconfiguration');
    }
    this.tempate_categories = [];
  }

  ngOnInit() {
    this.getEmailTemplateData();
  }
  public submitTemplate() {
    if (this.dummy) {
      this.createEmailTemplateForm.controls['emailtemplateconfig_id'].setValue(this.dummy.id);
    }
    if (this.templateCategory.value === '') {
      return false;
    }
    this.createEmailTemplateForm.controls['template_category'].setValue(this.templateCategory.value);
    this.createEmailTemplateForm.controls['client_id'].setValue(AppConstants.CLIENT_ID);
    const formModel = this.createEmailTemplateForm.value;
    // console.log(formModel);
    this.spinnerService.show();
    this.emailTemplateService.postEmailTemplateData(formModel, 'flujo_client_postemailtemplateconfig')
      .subscribe((result) => {
          if (result.custom_status_code === 101 && result.result.length === 0) {
            this.alertService.warning('Required parameters are missing');
            this.spinnerService.hide();
          } else if ((result.custom_status_code === 100) && (typeof (result.result) === 'object') && this.dummy != null) {
            const index = this.allEmailTemplates.findIndex(item => item.id === this.dummy.id);
            if (index !== undefined) {
              this.allEmailTemplates[index].template_category = this.templateCategory.value;
              this.allEmailTemplates[index].template_html = this.createEmailTemplateForm.value.template_html;
              this.allEmailTemplates[index].template_name = this.createEmailTemplateForm.value.template_name;
            }
            this.alertService.success('Template saved successfully');
            this.spinnerService.hide();
            this.createEmailTemplateForm.reset();
          } else if ((result.custom_status_code === 100) && (typeof (result.result[0]) === 'string')) {
            const id = result.result[0];
            this.allEmailTemplates.push({
              id: id,
              template_html: formModel.template_html,
              template_name: formModel.template_name,
              template_category: formModel.template_category
            });
            this.uniqueEmailTemplates = _.uniq(this.allEmailTemplates, function (x) {
              return x.template_category;
            });
            this.tempate_categories.push(formModel.template_category);
            this.spinnerService.hide();
            this.alertService.success('Template created successfully');
            this.createEmailTemplateForm.reset();
            this.templateCategory.setValue('');
            this.isView = true;
            this.isEdit = false;
          }
        this.spinnerService.hide();
        this.createEmailTemplateForm.reset();
      },
        error => {
          // console.log(error);
        }
      );
  }
  /*Getting of email template data from api using email service*/
  public getEmailTemplateData(): void {
    this.activatedRoute.data.subscribe(result => {
      this.spinnerService.hide();
      this.editOrUpdate = false;
        if (result.themedata.custom_status_code === 100 && result.themedata.result.length > 0) {
          this.allEmailTemplates = result.themedata.result;
          this.allEmailTemplates2 = result.themedata.result;
          this.uniqueEmailTemplates = _.uniq(result.themedata.result, function (x) {
            return x.template_category;
          });
          this.uniqueEmailTemplates.map((themeObject) => {
            this.tempate_categories.push(themeObject.template_category);
            this.getFilteredEmailCategories();
          });
          this.filteredThemes = this.allEmailTemplates;
        }
      // console.log(this.allEmailTemplates);
    },
      error => {
        // console.log(error);
      });
  }
  public getFilteredEmailCategories() {
    this.filteredOptions = this.templateCategory.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filter(val))
      );
  }

  public filter(val: string): string[] {
    return this.tempate_categories.filter(option => option.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }
  deleteEmailTemplate = (emailtemplateconfig_id) => {
    this.emailTemplateService.deleteEmailTemplateData(AppConstants.API_URL,
      'flujo_client_deleteemailtemplateconfig/', emailtemplateconfig_id)
      .subscribe((result) => {
        // console.log(result);
        if (result.error) {
          this.alertService.warning(result.result);
          this.spinnerService.hide();
        } else {
          this.alertService.success('Template delete successfully');
          this.spinnerService.hide();
          this.readTemplates(this.filteredThemes);
          // console.log(emailtemplateconfig_id);
          // console.log(this.allEmailTemplates);
          const theme_data = this.allEmailTemplates.filter((object) => object.id === emailtemplateconfig_id);
          const index = this.tempate_categories.indexOf(theme_data[0].template_category);
          if (index > -1) {
            this.tempate_categories.splice(index, 1);
          }
          this.allEmailTemplates = this.allEmailTemplates.filter((object) => object.id !== emailtemplateconfig_id);
          this.allEmailTemplates2 = this.allEmailTemplates;
          this.filteredThemes = this.allEmailTemplates;
          this.uniqueEmailTemplates = _.uniq(this.allEmailTemplates, function (x) {
            return x.template_category;
          });
          // console.log(this.tempate_categories.pop());
          // console.log(this.allEmailTemplates);
        }
      },
        error => {
          // console.log(error);
        }
      );
  }
  public readTemplates(theme_category): void {
    // console.log(theme_category);
    this.filteredThemes = this.allEmailTemplates2.filter((filterTemplate) => filterTemplate.template_category === theme_category);
    // console.log(this.filteredThemes);
  }
  setDefaultEmailTemplateDetails(emailTemplateItem) {
    if (emailTemplateItem) {
      this.createEmailTemplateForm.controls['template_name'].setValue(emailTemplateItem.template_name);
      this.createEmailTemplateForm.controls['template_category'].setValue(emailTemplateItem.template_category);
      this.createEmailTemplateForm.controls['template_html'].setValue(this.template_html1);
      this.createEmailTemplateForm.controls['emailtemplateconfig_id'].setValue(emailTemplateItem.id);
      this.templateCategory.setValue(emailTemplateItem.template_category);
      // console.log(this.createEmailTemplateForm.value);
    }
  }
  addEmailTemplate = () => {
    this.isEdit = true;
    this.createEmailTemplateForm.reset();
    this.dummy = null;
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
  public modelChanged(event) {
    // console.log(event);
    this.template_html = event;
  }

  cancelEditTemplate() {
    // console.log(this.allEmailTemplates);
    this.isEdit = false;
  }
}
