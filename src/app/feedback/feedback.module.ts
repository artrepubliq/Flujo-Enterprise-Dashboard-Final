import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedbackRoutingModule } from './feedback-routing.module';
import { FeedbackComponent } from './feedback.component';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { AlertModule } from 'ngx-alerts';
import { DatabaseModule } from '../database/database.module';
import { HeaderurlsComponent } from '../headerurls/headerurls.component';

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
    // HeaderurlsComponent
  ],
  declarations: [FeedbackComponent]
})
export class FeedbackModule { }
