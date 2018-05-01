import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProblemCategoryRoutingModule } from './problem-category-routing.module';
import { ProblemCategoryComponent } from './problem-category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { AlertModule } from 'ngx-alerts';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatAutocompleteModule, MatFormFieldModule, MatIconModule, MatInputModule,
   MatButtonModule, MatDialogModule } from '@angular/material';
import { PerfectScrollbarModule, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
   const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
  };
@NgModule({
  imports: [
    CommonModule,
    ProblemCategoryRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    Ng4LoadingSpinnerModule.forRoot(),
    AlertModule.forRoot(),
    FlexLayoutModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatDialogModule,
    PerfectScrollbarModule,
    MatButtonModule
  ],
  declarations: [ProblemCategoryComponent]
})
export class ProblemCategoryModule { }
