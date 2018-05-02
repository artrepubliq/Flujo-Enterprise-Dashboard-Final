import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TncRoutingModule } from './tnc-routing.module';
import { TncComponent } from './tnc.component';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-alerts';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CKEditorModule } from 'ngx-ckeditor';
import { PerfectScrollbarModule, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { MatCardModule } from '@angular/material';
const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
@NgModule({
  imports: [
    CommonModule,
    TncRoutingModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    AlertModule.forRoot(),
    Ng4LoadingSpinnerModule.forRoot(),
    FlexLayoutModule,
    CKEditorModule,
    PerfectScrollbarModule,
    MatCardModule
  ],
  declarations: [
    TncComponent
  ]
})
export class TncModule { }
