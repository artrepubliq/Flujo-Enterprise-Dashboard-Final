import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoRoutingModule } from './logo-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { ILogo } from '../model/logo.model';
import { AlertModule } from 'ngx-alerts';
import { LogoComponent } from '../logo/logo.component';
import { FlexLayoutModule } from '@angular/flex-layout';
@NgModule({
  imports: [
    CommonModule,
    LogoRoutingModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    Ng4LoadingSpinnerModule.forRoot(),
    AlertModule.forRoot(),
    FlexLayoutModule
  ],
  declarations: [
    LogoComponent
  ],
})
export class LogoModule { }
