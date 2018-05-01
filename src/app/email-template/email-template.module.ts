import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmailTemplateRoutingModule } from './email-template-routing.module';
import { EmailTemplateComponent } from './email-template.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { AlertModule } from 'ngx-alerts';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatAutocompleteModule, MatFormFieldModule, MatIconModule, MatInputModule, MatButtonModule } from '@angular/material';
import { CKEditorModule } from 'ngx-ckeditor';

@NgModule({
  imports: [
    CommonModule,
    EmailTemplateRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    Ng4LoadingSpinnerModule.forRoot(),
    AlertModule.forRoot(),
    FlexLayoutModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    CKEditorModule,
  ],
  declarations: []
})
export class EmailTemplateModule { }
