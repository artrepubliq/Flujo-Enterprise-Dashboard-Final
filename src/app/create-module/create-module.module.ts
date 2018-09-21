import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { ILogo } from '../model/logo.model';
import { AlertModule } from 'ngx-alerts';
import { CreateModuleComponent } from './create-module.component';
import { CreateModuleRoutingModule } from './create-module-routing.module';
import { ColorPickerModule } from 'ngx-color-picker';
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
    CreateModuleRoutingModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    Ng4LoadingSpinnerModule.forRoot(),
    AlertModule.forRoot(),
    ColorPickerModule,
    CKEditorModule,
    PerfectScrollbarModule,
    MatCardModule,
    FlexLayoutModule
  ],
  declarations: [
    // CreateModuleComponent,
  ],
  exports: [CreateModuleComponent, CreateModuleRoutingModule],
})
export class CreateModuleModule { }
