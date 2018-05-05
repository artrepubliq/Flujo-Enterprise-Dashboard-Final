import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThemeConfigRoutingModule } from './theme-config-routing.module';
import { ThemeConfigComponent } from './theme-config.component';
import { MatCardModule, MatSelectModule } from '@angular/material';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { AlertModule } from 'ngx-alerts';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
  imports: [
    CommonModule,
    ThemeConfigRoutingModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    AlertModule.forRoot(),
    Ng4LoadingSpinnerModule.forRoot(),
    FlexLayoutModule,
    PerfectScrollbarModule,
    MatCardModule,
    MatSelectModule,
    ColorPickerModule
  ],
  declarations: [
    ThemeConfigComponent
  ]
})
export class ThemeConfigModule { }
