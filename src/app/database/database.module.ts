import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatabaseRoutingModule } from './database-routing.module';
import { MatPaginatorModule, MatTableModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { HttpModule } from '@angular/http';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { AlertModule } from 'ngx-alerts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PerfectScrollbarModule, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { FlexLayoutModule } from '@angular/flex-layout';
const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
@NgModule({
  imports: [
    CommonModule,
    DatabaseRoutingModule,
    MatPaginatorModule,
    MatTableModule,
    HttpModule,
    Ng4LoadingSpinnerModule.forRoot(),
    AlertModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    PerfectScrollbarModule,
    FlexLayoutModule,
    MatInputModule,
  ],
  declarations: []
})
export class DatabaseModule { }
