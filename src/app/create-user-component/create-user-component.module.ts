import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateUserComponentRoutingModule } from './create-user-component-routing.module';
import { CreateUserComponentComponent } from './create-user-component.component';
import { MatDialogModule, MatFormFieldControl, MatFormFieldModule, MatInputModule, MatSelectModule } from '@angular/material';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { AlertModule } from 'ngx-alerts';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { FlexLayoutModule } from '@angular/flex-layout';
const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
@NgModule({
  imports: [
    CommonModule,
    CreateUserComponentRoutingModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    Ng4LoadingSpinnerModule.forRoot(),
    AlertModule.forRoot(),
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    MatSelectModule,
    FlexLayoutModule
  ],
  declarations: [CreateUserComponentComponent]
})
export class CreateUserComponentModule { }
