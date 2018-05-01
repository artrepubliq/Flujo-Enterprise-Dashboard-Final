import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SociallinksRoutingModule } from './sociallinks-routing.module';
import { SocialLinksComponent } from './sociallinks.component';
import { HttpModule } from '@angular/http';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { AlertModule } from 'ngx-alerts';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    SociallinksRoutingModule,
    HttpModule,
    Ng4LoadingSpinnerModule.forRoot(),
    AlertModule.forRoot(),
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    SocialLinksComponent
  ]
})
export class SociallinksModule { }
