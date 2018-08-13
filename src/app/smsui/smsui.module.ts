import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SmsuiRoutingModule } from './smsui-routing.module';
import { SmsuiComponent } from './smsui.component';
import { FileUploadModule } from 'ng2-file-upload';
import {
  MatButtonModule, MatSnackBarModule, MatDialogModule, MatSelectModule,
  MatFormFieldModule, MatInputModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { AlertModule } from 'ngx-alerts';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    SmsuiRoutingModule,
    FileUploadModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    HttpModule,
    Ng4LoadingSpinnerModule.forRoot(),
    AlertModule.forRoot(),
    FlexLayoutModule
  ],
  declarations: [SmsuiComponent]
})
export class SmsuiModule { }
