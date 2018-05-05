import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SocialconfigurationRoutingModule } from './socialconfiguration-routing.module';
import { SocialconfigurationComponent } from './socialconfiguration.component';
import { HttpModule } from '@angular/http';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { AlertModule } from 'ngx-alerts';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    SocialconfigurationRoutingModule,
    HttpModule,
    Ng4LoadingSpinnerModule.forRoot(),
    AlertModule.forRoot(),
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule
  ],
  declarations: [SocialconfigurationComponent]
})
export class SocialconfigurationModule { }
