import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BiographyRoutingModule } from './biography-routing.module';
import { BiographyComponent } from './biography.component';
import { MatDatepickerModule, MatInputModule, MatFormFieldModule } from '@angular/material';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { AlertModule } from 'ngx-alerts';
import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
  imports: [
    CommonModule,
    BiographyRoutingModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    Ng4LoadingSpinnerModule.forRoot(),
    AlertModule.forRoot(),
    ColorPickerModule
  ],
  declarations: [BiographyComponent]
})
export class BiographyModule { }
