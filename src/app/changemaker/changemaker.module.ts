import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChangemakerRoutingModule } from './changemaker-routing.module';
import { HttpModule } from '@angular/http';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { AlertModule } from 'ngx-alerts';
import { DatabaseModule } from '../database/database.module';
@NgModule({
  imports: [
    CommonModule,
    ChangemakerRoutingModule,
    HttpModule,
    Ng4LoadingSpinnerModule.forRoot(),
    AlertModule.forRoot(),
  ],
  declarations: [],
})
export class ChangemakerModule { }
