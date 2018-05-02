import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedbackRoutingModule } from './feedback-routing.module';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { AlertModule } from 'ngx-alerts';
import { DatabaseModule } from '../database/database.module';

@NgModule({
  imports: [
    CommonModule,
    FeedbackRoutingModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    Ng4LoadingSpinnerModule.forRoot(),
    AlertModule.forRoot(),
    DatabaseModule,
  ],
  declarations: []
})
export class FeedbackModule { }
