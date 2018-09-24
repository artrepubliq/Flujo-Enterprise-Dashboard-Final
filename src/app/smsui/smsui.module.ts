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
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { AlertModule } from 'ngx-alerts';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TokenInterceptor } from '../auth/token.interceptor';

@NgModule({
  imports: [
    CommonModule,
    SmsuiRoutingModule,
    FileUploadModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    MatInputModule,
    HttpClientModule,
    FormsModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    Ng4LoadingSpinnerModule.forRoot(),
    AlertModule.forRoot(),
    FlexLayoutModule
  ],
  declarations: [SmsuiComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
  ]
})
export class SmsuiModule { }
