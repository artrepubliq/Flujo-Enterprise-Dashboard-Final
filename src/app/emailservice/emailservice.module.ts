import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmailserviceRoutingModule } from './emailservice-routing.module';
import { EmailserviceComponent } from './emailservice.component';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { AlertModule } from 'ngx-alerts';
import { CKEditorModule } from 'ngx-ckeditor';
import { PerfectScrollbarModule, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { MatCardModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
@NgModule({
  imports: [
    CommonModule,
    EmailserviceRoutingModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    Ng4LoadingSpinnerModule.forRoot(),
    AlertModule.forRoot(),
    CKEditorModule,
    PerfectScrollbarModule,
    MatCardModule,
    FlexLayoutModule
  ],
  declarations: [EmailserviceComponent]
})
export class EmailserviceModule { }
