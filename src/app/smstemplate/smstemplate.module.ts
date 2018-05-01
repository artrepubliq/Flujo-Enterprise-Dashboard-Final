import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SmstemplateRoutingModule } from './smstemplate-routing.module';
import { SmstemplateComponent } from './smstemplate.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { AlertModule } from 'ngx-alerts';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatAutocompleteModule, MatFormFieldModule, MatIconModule, MatInputModule, MatButtonModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    SmstemplateRoutingModule,
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
    MatButtonModule
  ],
  declarations: [
    SmstemplateComponent
  ]
})
export class SmstemplateModule { }
