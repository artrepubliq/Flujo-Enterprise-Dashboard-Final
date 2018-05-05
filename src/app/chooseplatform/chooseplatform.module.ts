import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChooseplatformRoutingModule } from './chooseplatform-routing.module';
import { ChooseplatformComponent } from './chooseplatform.component';
import { HttpModule } from '@angular/http';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { AlertModule } from 'ngx-alerts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    ChooseplatformRoutingModule,
    HttpModule,
    Ng4LoadingSpinnerModule.forRoot(),
    AlertModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule
  ],
  declarations: [ChooseplatformComponent]
})
export class ChooseplatformModule { }
