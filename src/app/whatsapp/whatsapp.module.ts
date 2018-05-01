import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhatsappRoutingModule } from './whatsapp-routing.module';
import { WhatsappComponent } from './whatsapp.component';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-alerts';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    WhatsappRoutingModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    AlertModule.forRoot(),
    Ng4LoadingSpinnerModule.forRoot(),
    FlexLayoutModule
  ],
  declarations: [
    WhatsappComponent,
  ]
})
export class WhatsappModule { }
