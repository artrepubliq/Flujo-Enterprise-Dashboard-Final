import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilerepositoryRoutingModule } from './filerepository-routing.module';
import { FilerepositoryComponent } from './filerepository.component';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { AlertModule } from 'ngx-alerts';
import { MatInputModule, MatFormFieldModule, MatCheckboxModule,
  MatDialogModule, MatButtonModule, MatIconModule, MatOptionModule,
   MatSelectModule, MatAutocomplete, MatAutocompleteModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FileUploadModule } from 'ng2-file-upload';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  imports: [
    CommonModule,
    FilerepositoryRoutingModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    Ng4LoadingSpinnerModule.forRoot(),
    AlertModule.forRoot(),
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    FlexLayoutModule,
    FileUploadModule,
    PdfViewerModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule,
    MatAutocompleteModule
  ],
  declarations: [
    FilerepositoryComponent
  ]
})
export class FilerepositoryModule { }
