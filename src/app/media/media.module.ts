import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MediaRoutingModule } from './media-routing.module';
import { MediaComponent } from './media.component';
import { FileUploadModule } from 'ng2-file-upload';
import { ImageUploadModule } from 'angular2-image-upload';
import { MatDialogModule, MatButtonModule, MatOptionModule,
  MatSelectModule,
  MatTabsModule,
  MatInputModule,
  MatAutocompleteModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AlertModule } from 'ngx-alerts';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    MediaRoutingModule,
    HttpModule,
    FileUploadModule,
    ImageUploadModule,
    MatDialogModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    AlertModule.forRoot(),
    Ng4LoadingSpinnerModule.forRoot(),
    MatOptionModule,
    MatSelectModule,
    MatTabsModule,
    FlexLayoutModule
  ],
  declarations: [MediaComponent]
})
export class MediaModule { }
