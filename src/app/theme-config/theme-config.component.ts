import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'ngx-alerts';
import { HttpClient } from '@angular/common/http';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { NgxSmartLoaderService } from 'ngx-smart-loader';
import { Observable } from 'rxjs/Observable';
import { IHttpResponse } from '../model/httpresponse.model';
import { AppConstants } from '../app.constants';

@Component({
  selector: 'app-theme-config',
  templateUrl: './theme-config.component.html',
  styleUrls: ['./theme-config.component.scss']

})
export class ThemeConfigComponent implements OnInit {
  title_color= '';
  body_font_family= '';
  primary_menu_title_color= '';
  title_font= '';
  child_menu_title_color= '';
  primary_menu_hover_color= '';
  child_menu_hover_color= '';
  theme_font_size= '';
  theme_id= '';
  themeConfigForm: FormGroup;

  constructor(
    public loader: NgxSmartLoaderService,
    private spinnerService: Ng4LoadingSpinnerService,
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private alertService: AlertService ) {

      this.themeConfigForm = this.formBuilder.group({
        'body_font_family': ['', Validators.required],
        'title_font': ['', Validators.required],
        'title_color': ['', Validators.required],
        'primary_menu_title_color': ['', Validators.required],
        'child_menu_title_color': ['', Validators.required],
        'primary_menu_hover_color': ['', Validators.required],
        'child_menu_hover_color': ['', Validators.required],
        'theme_font_size': ['', Validators.required],
        'theme_id': ['']
      });
      
  }
  getThemeDetails = () => {
   // console.log(AppConstants.API_URL+"flujo_client_gettexttheme/"+AppConstants.CLIENT_ID);
    
    // this.loadingSave = true;
    this.spinnerService.show();
    this.httpClient.get(AppConstants.API_URL+"flujo_client_gettexttheme/"+AppConstants.CLIENT_ID)
        .subscribe(
          data =>{
            console.log(data);
            if(data != null){
             this.spinnerService.hide();
             this.setThemeDetails(data);
            } else{
              this.alertService.success('No Data found');
              this.spinnerService.hide();   
            }
          },
          error =>{
            console.log(error);
          }
        );
  }
  setThemeDetails = (themeData) => {

    if (themeData) {
      
      this.themeConfigForm.controls['body_font_family'].setValue(themeData[0].body_font_family);
      this.body_font_family = themeData[0].body_font_family;
      this.themeConfigForm.controls['title_font'].setValue(themeData[0].title_font);
      this.title_font = themeData[0].title_font;
      this.themeConfigForm.controls['title_color'].setValue(themeData[0].title_color);
      this.title_color = themeData[0].title_color;
      this.themeConfigForm.controls['primary_menu_title_color'].setValue(themeData[0].primary_menu_title_color);
      this.primary_menu_title_color = themeData[0].primary_menu_title_color;
      this.themeConfigForm.controls['child_menu_title_color'].setValue(themeData[0].child_menu_title_color);
      this.child_menu_title_color = themeData[0].child_menu_title_color;
      this.themeConfigForm.controls['primary_menu_hover_color'].setValue(themeData[0].primary_menu_hover_color);
      this.primary_menu_hover_color = themeData[0].primary_menu_hover_color;
      this.themeConfigForm.controls['child_menu_hover_color'].setValue(themeData[0].child_menu_hover_color);
      this.child_menu_hover_color = themeData[0].child_menu_hover_color;
      this.themeConfigForm.controls['theme_font_size'].setValue(themeData[0].theme_font_size);
      this.themeConfigForm.controls['theme_id'].setValue(themeData[0].id);
      this.theme_id = themeData[0].id;
    }
  }

  submitTheme() {
    //console.log(this.themeConfigForm.value);
    let themeData = this.themeConfigForm.value;
    themeData.client_id = AppConstants.CLIENT_ID;
    console.log(themeData);
    this.spinnerService.show();
    this.httpClient.post<IHttpResponse>( AppConstants.API_URL + 'flujo_client_posttexttheme', this.themeConfigForm.value)
            .subscribe(
              data => {
                  if (data.error) {
                      this.alertService.warning(data.result);
                      console.log(data);
                      this.spinnerService.hide();
                  }else {
                    this.alertService.success("Theme details updated successfully");
                    this.spinnerService.hide();
                  }
              },
              error => {
                  // this.loading = false;
                  this.spinnerService.hide();
            });
        }
  ngOnInit() {
    this.getThemeDetails();
  }

}
