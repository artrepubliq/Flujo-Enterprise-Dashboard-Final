import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { IPostEmailTemplate } from '../model/emailThemeConfig.model';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { AppConstants } from '../app.constants';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AlertService } from 'ngx-alerts';
import { EmailTemplateService } from '../email-template/email-template-service';
import { startWith, map } from 'rxjs/operators';
import * as _ from 'underscore';
import { ActivatedRoute } from '@angular/router';
// import grapesjs from 'grapesjs';
declare var require: any;
@Component({
  selector: 'app-email-builder',
  templateUrl: './email-builder.component.html',
  styleUrls: ['./email-builder.component.scss']
})
export class EmailBuilderComponent implements OnInit {
  @Input() editEmailTemplateData: any;
  @Output() goBack = new EventEmitter();
  filteredOptions: Observable<string[]>;
  templateCategory: FormControl;
  myControl = new FormControl();
  options: string[] = [];
  img: any;
  test: any;
  config: any;
  tempate_categories: string[];
  dummy: any;
  template_html1: any;
  isEdit = false;
  filteredThemes: IPostEmailTemplate[];
  uniqueEmailTemplates: IPostEmailTemplate[];
  allEmailTemplates: IPostEmailTemplate[];
  allEmailTemplates2: IPostEmailTemplate[];
  public editOrUpdate: boolean;
  public data: IPostEmailTemplate;
  public createEmailTemplateForm: any;
  public template_html: any;
  emailTemplateHtml: string;
  emailTemplateData: any;
  mainEmailData: any;
  defaultEditorData = [];
  globalEditor: any;
  constructor(private spinnerService: Ng4LoadingSpinnerService,
    private alertService: AlertService,
    private emailTemplateService: EmailTemplateService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder) {
    this.createEmailTemplateForm = this.formBuilder.group({
      'template_name': ['', Validators.required],
      'template_category': [''],
      'template_html': ['', Validators.required],
      'emailtemplateconfig_id': [''],
      'client_id': ['']
    });
    this.getEmailTemplateData();
  }

  ngOnInit() {
    // this.filteredOptions = this.myControl.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(value => this.filter(value))
    //   );
    const grapesjs = require('grapesjs');
    const nlPlugin = require('grapesjs-preset-newsletter');
    grapesjs.plugins.add('gjs-preset-newsletter-2', nlPlugin.default);
    const editor = grapesjs.init({
      container: '#gjs',
      fromElement: true,
      height: '60vh',
      storageManager: { autoload: 0 },
      plugins: ['gjs-preset-newsletter', 'gjs-aviary'],
      pluginsOpts: {
        'gjs-preset-newsletter': {
          modalLabelImport: 'Paste all your code here below and click import',
          modalLabelExport: 'Copy the code and use it wherever you want',
          codeViewerTheme: 'material',
          importPlaceholder: '<table class="table"><tr><td class="cell">Hello world!</td></tr></table>',
          cellStyle: {
            'font-size': '12px',
            'font-weight': 300,
            'vertical-align': 'top',
            color: 'rgb(111, 119, 125)',
            margin: 0,
            padding: 0,
          }
        },
        'gjs-aviary': {}
      },
      assetManager: {
        embedAsBase64: 1,
        upload: 'https://test.page',
        params: {
          _token: 'pCYrSwjuiV0t5NVtZpQDY41Gn5lNUwo3it1FIkAj',
        },
        assets: [
          { type: 'image', src: 'http://placehold.it/350x250/78c5d6/fff/image1.jpg', height: 350, width: 250 },
          { type: 'image', src: 'http://placehold.it/350x250/459ba8/fff/image2.jpg', height: 350, width: 250 },
          { type: 'image', src: 'http://placehold.it/350x250/79c267/fff/image3.jpg', height: 350, width: 250 },
          { type: 'image', src: 'http://placehold.it/350x250/c5d647/fff/image4.jpg', height: 350, width: 250 },
          { type: 'image', src: 'http://placehold.it/350x250/f28c33/fff/image5.jpg', height: 350, width: 250 },
          { type: 'image', src: 'http://placehold.it/350x250/e868a2/fff/image6.jpg', height: 350, width: 250 },
          { type: 'image', src: 'http://placehold.it/350x250/cc4360/fff/image7.jpg', height: 350, width: 250 },
          { type: 'image', src: 'http://placehold.it/350x250/cc4360/fff/image7.jpg', date: '2015-02-01', height: 1080, width: 1728 },
          { type: 'image', src: 'http://placehold.it/350x250/cc4360/fff/image7.jpg', date: '2015-02-01', height: 650, width: 320 },
          { type: 'image', src: 'http://placehold.it/350x250/cc4360/fff/image7.jpg', date: '2015-02-01', height: 1, width: 1728 },
        ]
      },
    });
    this.globalEditor = editor;
    if (this.defaultEditorData.length > 0) {
      editor.setComponents(this.defaultEditorData[0].template_html);
    }
    if (this.editEmailTemplateData) {
      editor.setComponents(this.editEmailTemplateData);
    }
  }
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
        console.log(this.uniqueEmailTemplates);
        this.uniqueEmailTemplates.map((themeObject) => {
          this.options.push(themeObject.template_category);
          this.getFilteredEmailCategories();
        });
        this.filteredThemes = this.allEmailTemplates;
        this.setDefaultEmailData(this.filteredThemes);
      }
      // console.log(this.allEmailTemplates);
    },
      error => {
        // console.log(error);
      });
  }
  public submitTemplate() {
    this.emailTemplateHtml = this.globalEditor.runCommand('gjs-get-inlined-html');
    this.createEmailTemplateForm.controls['template_html'].setValue(this.emailTemplateHtml);
    this.createEmailTemplateForm.controls['client_id'].setValue(AppConstants.CLIENT_ID);
    this.createEmailTemplateForm.controls['template_category'].setValue(this.myControl.value);
    if (this.defaultEditorData.length > 0) {
      this.createEmailTemplateForm.controls['emailtemplateconfig_id'].setValue(this.defaultEditorData[0].id);
    }
    const formModel = this.createEmailTemplateForm.value;
    this.emailTemplateService.postEmailTemplateData(formModel, 'flujo_client_postemailtemplateconfig')
      .subscribe(
        data => {
          if (data.custom_status_code === 100 && !data.error) {
            this.alertService.success('Template submitted successfully');
          } else if (data.error && data.custom_status_code === 102) {
            this.alertService.info('No modification to update');
          } else if (data.error && data.custom_status_code === 105) {
            this.alertService.warning('Required parameters are missing');
          }
        }, err => {
          console.log(err);
          this.alertService.danger('Something went wrong');
        }
      );
  }
  public getFilteredEmailCategories() {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filter(val))
      );
  }
  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
  setDefaultEmailData = (filteredThemes) => {
    if (this.activatedRoute.snapshot.params['id']) {
      this.mainEmailData = _.filter(filteredThemes, (test) => {
        // tslint:disable-next-line:radix
        if (test.id === parseInt(this.activatedRoute.snapshot.params['id'])) {
          this.defaultEditorData.push(test);
        }
      });
      this.myControl.setValue(this.defaultEditorData[0].template_category);
      this.createEmailTemplateForm.controls['template_name'].setValue(this.defaultEditorData[0].template_name);
      // this.createEmailTemplateForm.controls['template_html'].setValue(this.defaultEditorData[0].template_html);
    }
  }
  goBacktoParent = () => {
    this.goBack.emit(true);
  }
}
