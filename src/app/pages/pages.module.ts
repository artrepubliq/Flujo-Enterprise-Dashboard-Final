import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-alerts';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CKEditorModule } from 'ngx-ckeditor';
import { PerfectScrollbarModule, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { MatCardModule, MatOptionModule, MatSelectModule } from '@angular/material';
import { ColorPickerModule } from 'ngx-color-picker';
const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
@NgModule({
  imports: [
    CommonModule,
    PagesRoutingModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    AlertModule.forRoot(),
    Ng4LoadingSpinnerModule.forRoot(),
    FlexLayoutModule,
    CKEditorModule,
    PerfectScrollbarModule,
    MatCardModule,
    MatOptionModule,
    ColorPickerModule,
    MatSelectModule
  ],
  declarations: [
    PagesComponent
  ]
})
export class PagesModule { }
