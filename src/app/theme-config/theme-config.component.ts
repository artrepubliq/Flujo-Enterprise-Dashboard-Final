import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NgxSmartLoaderService } from 'ngx-smart-loader';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { HttpClient } from '@angular/common/http';
import { AlertService } from 'ngx-alerts';
import { AppConstants } from '../app.constants';
import { IHttpResponse } from '../model/httpresponse.model';
import { IThemeData } from '../model/themeData.model';
import { AdminComponent } from '../admin/admin.component';
import { Router } from '@angular/router';
import * as _ from 'underscore';
import { AccessDataModelComponent } from '../model/useraccess.data.model';
@Component({
  selector: 'app-theme-config',
  templateUrl: './theme-config.component.html',
  styleUrls: ['./theme-config.component.scss']

})

export class ThemeConfigComponent implements OnInit {
  filteredUserAccessData: any;
  userAccessLevelObject: any;
  gradientColor: string;
  gradient_title_color1: any;
  gradient_title_color2: any;
  PrimaryMenuTitleColor: any;
  ChildMenuTitleColor: any;
  PrimaryMenuOverColor: any;
  ChildMenuOverColor: any;
  selectedBodyFont: string;
  selectedTitleFont: string;
  theme_id: number;
  userAccessDataModel: AccessDataModelComponent;
  updatedThemeData: IThemeData;
  feature_id = 15;
  TitleFontFamily: any = [
    { id: 1, name: 'Roboto' },
    { id: 2, name: 'Lato' },
    { id: 3, name: 'Raleway' },
    { id: 4, name: 'Roboto Slab' },
    { id: 5, name: 'Montserrat' },
    { id: 6, name: 'Merriweather' }
  ];
  themeConfigForm: FormGroup;
  selectedFont: any;
  fontSize = 12;
  min = 8;
  max = 30;
  log = '';
  onOptionSelected(event) {
    console.log(event); // option value will be sent as event
  }

  constructor(
    public loader: NgxSmartLoaderService,
    private spinnerService: Ng4LoadingSpinnerService,
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private alertService: AlertService,
    public adminComponent: AdminComponent,
    private router: Router) {

    this.themeConfigForm = this.formBuilder.group({
      'title_font': ['', Validators.required],
      'body_font_family': ['', Validators.required],
      'theme_font_size': ['', Validators.required],
      'primary_menu_title_color': ['', Validators.required],
      'child_menu_title_color': ['', Validators.required],
      'gradient_title_color1': ['', Validators.required],
      'gradient_title_color2': ['', Validators.required],
      'primary_menu_hover_color': ['', Validators.required],
      'child_menu_hover_color': ['', Validators.required],
      'theme_id': [null]
    });
    if (Number(localStorage.getItem('feature_id')) !== this.feature_id) {
      this.userAccessDataModel = new AccessDataModelComponent(httpClient, router);
      this.userAccessDataModel.setUserAccessLevels(null, this.feature_id, 'admin/themeconfiguration');
    }
  }

  /* this is for on submitting the form*/
  submitTheme() {
    // console.log(this.themeConfigForm.value);
    this.themeConfigForm.controls['theme_id'].setValue(AppConstants.THEME_ID);
    const themeData = this.themeConfigForm.value;
    themeData.client_id = AppConstants.CLIENT_ID;
    console.log(themeData);
    this.spinnerService.show();
    this.httpClient.post<IThemeData>(AppConstants.API_URL + 'flujo_client_posttexttheme', themeData)
      .subscribe(
        data => {
          if (data.error) {
            this.alertService.warning(data.result);
            console.log(data);
            this.spinnerService.hide();
          } else {
            this.alertService.success('Theme details updated successfully');
            this.spinnerService.hide();
            // this.updatedThemeData = data;
            // if(this.updatedThemeData.data[0].theme_id){
            // }
          }
        },
        error => {
          // this.loading = false;
          this.spinnerService.hide();
        });
  }
  // logDropdown(id: number): void {
  //   const NAME = this.TitleFontFamily.find((item: any) => item.id === +id).name;
  // }
  /* this is to get theme details  from server*/
  getThemeDetails = () => {
    this.spinnerService.show();
    this.httpClient.get(AppConstants.API_URL + 'flujo_client_gettexttheme/' + AppConstants.CLIENT_ID)
      .subscribe(
        data => {
          console.log(data);
          if (data != null) {
            this.spinnerService.hide();
            this.setThemeDetails(data);
          } else {
            this.alertService.success('No Data found');
            this.spinnerService.hide();
          }
        },
        error => {
          console.log(error);
        }
      );
  }

  /* this is to set theme details in the form */
  setThemeDetails = (themeData) => {
    if (themeData) {
      console.log(themeData);
      this.themeConfigForm.controls['body_font_family'].setValue(themeData[0].body_font_family);
      this.selectedBodyFont = themeData[0].body_font_family;

      this.themeConfigForm.controls['title_font'].setValue(themeData[0].title_font);
      this.selectedTitleFont = themeData[0].title_font;

      this.themeConfigForm.controls['gradient_title_color1'].setValue(themeData[0].gradient_title_color1);
      this.gradient_title_color1 = themeData[0].gradient_title_color1;

      this.themeConfigForm.controls['gradient_title_color2'].setValue(themeData[0].gradient_title_color2);
      this.gradient_title_color2 = themeData[0].gradient_title_color2;

      this.themeConfigForm.controls['primary_menu_title_color'].setValue(themeData[0].primary_menu_title_color);
      this.PrimaryMenuTitleColor = themeData[0].primary_menu_title_color;

      this.themeConfigForm.controls['child_menu_title_color'].setValue(themeData[0].child_menu_title_color);
      this.ChildMenuTitleColor = themeData[0].child_menu_title_color;

      this.themeConfigForm.controls['primary_menu_hover_color'].setValue(themeData[0].primary_menu_hover_color);
      this.PrimaryMenuOverColor = themeData[0].primary_menu_hover_color;

      this.themeConfigForm.controls['child_menu_hover_color'].setValue(themeData[0].child_menu_hover_color);
      this.ChildMenuOverColor = themeData[0].child_menu_hover_color;

      // tslint:disable-next-line:radix
      this.themeConfigForm.controls['theme_font_size'].setValue(parseInt(themeData[0].theme_font_size));
      // tslint:disable-next-line:radix
      this.fontSize = parseInt(themeData[0].theme_font_size);

      this.themeConfigForm.controls['theme_id'].setValue(themeData[0].id);
      this.theme_id = themeData[0].id;

      this.gradientColor = 'linear-gradient(130deg, ' + themeData[0].gradient_title_color1 + ', ' +
        themeData[0].gradient_title_color2 + ')';
      // console.log(this.theme_id);
    }
  }

  /* this is for resetting the theme config form*/
  resetForm() {
    this.themeConfigForm.controls['body_font_family'].setValue('');
    this.selectedBodyFont = '';

    this.themeConfigForm.controls['title_font'].setValue('');
    this.selectedTitleFont = '';

    this.themeConfigForm.controls['gradient_title_color1'].setValue('');
    this.gradient_title_color1 = '';

    this.themeConfigForm.controls['gradient_title_color2'].setValue('');
    this.gradient_title_color2 = '';

    this.themeConfigForm.controls['primary_menu_title_color'].setValue('');
    this.PrimaryMenuTitleColor = '';

    this.themeConfigForm.controls['child_menu_title_color'].setValue('');
    this.ChildMenuTitleColor = '';

    this.themeConfigForm.controls['primary_menu_hover_color'].setValue('');
    this.PrimaryMenuOverColor = '';

    this.themeConfigForm.controls['child_menu_hover_color'].setValue('');
    this.ChildMenuOverColor = '';

    this.themeConfigForm.controls['theme_font_size'].setValue(12);
    this.fontSize = 12;

    // this.themeConfigForm.controls['theme_id'].setValue(themeData[0].id);
    // this.theme_id = themeData[0].id;
  }

  // this is to set gradient color
  setGradientLeft(event) {
    // console.log(event);
    this.gradientColor = 'linear-gradient(130deg, ' + this.gradient_title_color1 + ', ' + this.gradient_title_color2 + ')';
    console.log(this.gradientColor);
  }

  setGradientRight(event) {
    // console.log(event);
    this.gradientColor = 'linear-gradient(130deg, ' + this.gradient_title_color1 + ', ' + this.gradient_title_color2 + ')';
    console.log(this.gradientColor);
  }
  ngOnInit() {
    this.getThemeDetails();
  }

}
