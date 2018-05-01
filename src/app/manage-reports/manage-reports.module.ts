import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageReportsRoutingModule } from './manage-reports-routing.module';
import { ManageReportsComponent } from './manage-reports.component';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { AlertModule } from 'ngx-alerts';
import { MatInputModule, MatFormFieldModule, MatCheckboxModule, MatAutocompleteModule,
   MatPaginatorModule, MatExpansionModule, MatAccordion, MatCardModule } from '@angular/material';
import { PerfectScrollbarModule, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { NgxPaginationModule } from 'ngx-pagination';
import { FlexLayoutModule } from '@angular/flex-layout';
const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
@NgModule({
  imports: [
    CommonModule,
    ManageReportsRoutingModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    Ng4LoadingSpinnerModule.forRoot(),
    AlertModule.forRoot(),
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    PerfectScrollbarModule,
    MatAutocompleteModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatCardModule,
    NgxPaginationModule,
    FlexLayoutModule
  ],
  declarations: [
    ManageReportsComponent
  ]
})
export class ManageReportsModule { }
