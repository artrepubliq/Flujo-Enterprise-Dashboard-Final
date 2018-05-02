import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PnpRoutingModule } from './pnp-routing.module';
import { PnpComponent } from './pnp.component';
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
    PnpRoutingModule,
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
    PnpComponent
  ]
})
export class PnpModule { }
