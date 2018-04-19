import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertModule, AlertService } from 'ngx-alerts';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Tree } from '@angular/router/src/utils/tree';
import { AppConstants } from '../app.constants';
import { HttpClient } from '@angular/common/http';
import { IHttpResponse } from '../model/httpresponse.model';
import { ColorPickerModule, ColorPickerDirective } from 'ngx-color-picker';
import { MatDatepickerInputEvent, NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { Router } from '@angular/router';
import * as _ from 'underscore';
import { AccessDataModelComponent } from '../model/useraccess.data.model';
import { ICommonInterface } from '../model/commonInterface.model';
export class AppDateAdapter extends NativeDateAdapter {

  format(date: Date, displayFormat: Object): string {

    if (displayFormat === 'input') {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    } else {
      return date.toDateString();
    }
  }
}

export const APP_DATE_FORMATS = {
  parse: {
    dateInput: { month: 'short', year: 'numeric', day: 'numeric' },
  },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'numeric' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  }
};
@Component({
  selector: 'app-biography',
  templateUrl: './biography.component.html',
  styleUrls: ['./biography.component.scss'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class BiographyComponent implements OnInit {

  filteredUserAccessData: any;
  userAccessLevelObject: any;
  biographySubmitForm: any;
  bgColor = '#3c3c3c';
  events: string[] = [];
  startDate = new Date(1990, 0, 1);
  startDate2 = new Date(1990, 1, 1);
  minDate = new Date(1990, 1, 1);
  maxDate = new Date(2019, 1, 1);
  userAccessDataModel: AccessDataModelComponent;
  feature_id = 19;
  @Output() add = new EventEmitter();
  constructor(private spinnerService: Ng4LoadingSpinnerService, private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private alertService: AlertService, private router: Router) {
    this.biographySubmitForm = this.formBuilder.group({
      'career_position': ['', Validators.required],
      'from_year': [null],
      'to_year': [null],
      'career_description': ['', Validators.required],
      background_color: [''],
      'client_id': [null]
    });
    if (Number(localStorage.getItem('feature_id')) !== this.feature_id) {
      this.userAccessDataModel = new AccessDataModelComponent(httpClient, router);
      this.userAccessDataModel.setUserAccessLevels(null, this.feature_id, 'admin/biography');
    }
  }

  ngOnInit() {
  }
  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.events.push(`${type}: ${event.value}`);
  }
  onSubmit() {
    this.spinnerService.show();
    this.biographySubmitForm.controls['client_id'].setValue(AppConstants.CLIENT_ID);
    const formModel = this.biographySubmitForm.value;
    this.httpClient.post<ICommonInterface>(AppConstants.API_URL + 'flujo_client_postbiography', formModel)
      .subscribe(
        data => {
          if (AppConstants.ACCESS_TOKEN === data.access_token) {
            if ((!data.error) && (data.custom_status_code === 100)) {
              this.alertService.success('Biography data submitted successfully');
              this.biographySubmitForm.reset();
            } else if (data.custom_status_code === 101) {
              this.alertService.warning('Required parameters are missing!');
            } else if (data.custom_status_code === 102) {
              this.alertService.warning('Everything is upto date!');
            }
          }
          this.spinnerService.hide();
          // if (!data.error) {
          //   this.spinnerService.hide();
          //   this.alertService.success('Biography data submitted successfully');
          //   this.biographySubmitForm.reset();
          // } else {
          //   this.spinnerService.hide();
          //   this.alertService.warning('From date and to date are incorrect');
          // }
        },
        error => {
          this.spinnerService.hide();
          this.alertService.warning('From date and to date are incorrect');
        });
  }
}
