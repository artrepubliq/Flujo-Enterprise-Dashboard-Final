import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChangemakerRoutingModule } from './changemaker-routing.module';
import { ChangemakerComponent } from './changemaker.component';
import { HttpModule } from '@angular/http';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { AlertModule } from 'ngx-alerts';
import { DatabaseModule } from '../database/database.module';
import { HeaderurlsComponent } from '../headerurls/headerurls.component';

@NgModule({
  imports: [
    CommonModule,
    ChangemakerRoutingModule,
    HttpModule,
    Ng4LoadingSpinnerModule.forRoot(),
    AlertModule.forRoot(),
    // HeaderurlsComponent
  ],
  declarations: [ChangemakerComponent],
})
export class ChangemakerModule { }
