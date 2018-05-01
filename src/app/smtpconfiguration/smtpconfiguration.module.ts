import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SmtpconfigurationRoutingModule } from './smtpconfiguration-routing.module';
import { SMTPConfigurationComponent } from './smtpconfiguration.component';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { AlertModule } from 'ngx-alerts';
import { HttpModule } from '@angular/http';
import { MatButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    SmtpconfigurationRoutingModule,
    Ng4LoadingSpinnerModule.forRoot(),
    AlertModule.forRoot(),
    HttpModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule
  ],
  declarations: [SMTPConfigurationComponent]
})
export class SmtpconfigurationModule { }
