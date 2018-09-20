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
  biographyEditForm: FormGroup;
  showAdd = true;
  showList = true;
  biographyData: any[];
  filteredUserAccessData: any;
  userAccessLevelObject: any;
  biographySubmitForm: any;
  bgColor = '#3c3c3c';
  events: string[] = [];
  events_edit: string[] = [];
  startDate = new Date(1980, 0, 1);
  minDate = new Date(1980, 1, 1);
  maxDate = new Date(2019, 1, 1);
  startDate_edit = new Date(1980, 0, 1);
  minDate_edit = new Date(1980, 1, 1);
  maxDate_edit = new Date(2019, 1, 1);
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
      'background_color': [''],
      'client_id': [null],
      'biography_id': [null]
    });
  }

  ngOnInit() {
    this.getBiography();
  }
  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.events.push(`${type}: ${event.value}`);
  }

  addNewItem() {
    this.showList = false;
    this.showAdd = false;
  }

  showListView() {
    this.showList = true;
    this.showAdd = true;
    this.biographySubmitForm.reset();
  }

  updateItem(id: string) {
    this.getItemObject(id);
  }

  // moduleData is an object type.
  updateFormValues(moduleData: any) {
    if (moduleData) {
        this.biographySubmitForm.controls['career_position'].setValue(moduleData.career_position);
        this.biographySubmitForm.controls['from_year'].setValue(moduleData.from_year);
        this.biographySubmitForm.controls['biography_id'].setValue(moduleData.id);
        this.biographySubmitForm.controls['to_year'].setValue(moduleData.to_year);
        this.biographySubmitForm.controls['career_description'].setValue(moduleData.career_description);
        this.biographySubmitForm.controls['background_color'].setValue(moduleData.background_color);
        this.addNewItem();
    }

}
  // get the object for updating
  getItemObject(id: string) {
    const item = this.biographyData.find(function(element) {
      return element.id === id;
    });
    this.updateFormValues(item);
  }

  getBiography() {
    this.httpClient.get<ICommonInterface>(AppConstants.API_URL + 'flujo_client_getbiography/' + AppConstants.CLIENT_ID)
    .subscribe(
      data => {
        if ((!data.error) && (data.custom_status_code === 100)) {
          this.biographyData = data.result;
          console.log(this.biographyData);
        } else if (data.custom_status_code === 101) {
          this.alertService.warning('Required parameters are missing!');
        }
      this.spinnerService.hide();
      },
      error => {
        this.spinnerService.hide();
        this.alertService.warning('Could not get Data.');
      }
    );
  }

  deleteItem(id: string) {
    this.httpClient.delete<ICommonInterface>(AppConstants.API_URL + 'flujo_client_deletebiography/' + id)
    .subscribe(
      data => {
        if ((!data.error) && (data.custom_status_code === 100)) {
          this.getBiography();
          console.log(this.biographyData);
          this.alertService.success('Deleted Successfully.');
        } else if (data.custom_status_code === 101) {
          this.alertService.warning('Required parameters are missing!');
        }
      this.spinnerService.hide();
      },
      error => {
        this.spinnerService.hide();
        this.alertService.warning('Could not get Data.');
      }
    );
  }

  onSubmit() {
    this.spinnerService.show();
    this.biographySubmitForm.controls['client_id'].setValue(AppConstants.CLIENT_ID);
    const formModel = this.biographySubmitForm.value;
    if (formModel.background_color === '') {
      formModel.background_color = '#3c3c3c';
    }
    console.log(formModel);
    this.httpClient.post<ICommonInterface>(AppConstants.API_URL + 'flujo_client_postbiography', formModel)
      .subscribe(
        data => {
            if ((!data.error) && (data.custom_status_code === 100)) {
              this.alertService.success('Biography data submitted successfully');
              this.biographySubmitForm.reset();
              this.getBiography();
              this.showAdd = true;
              this.showList = true;
            } else if (data.custom_status_code === 101) {
              this.alertService.warning('Required parameters are missing!');
            } else if (data.custom_status_code === 102) {
              this.alertService.warning('Everything is upto date');
            } else if (data.custom_status_code === 106) {
              this.alertService.warning('Enter valid details');
            } else if (data.custom_status_code === 109) {
              this.alertService.warning('Enter valid dates');
          }
          this.spinnerService.hide();
        },
        error => {
          this.spinnerService.hide();
          this.alertService.warning('From date and to date are incorrect');
        });
  }
}
