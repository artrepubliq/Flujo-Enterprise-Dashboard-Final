import { Component, OnInit, ElementRef, ViewChild, SimpleChanges } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Http, Headers, RequestOptions } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { mediaDetail } from '../model/feedback.model';
import { AlertModule, AlertService } from 'ngx-alerts';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { FileUploadModule } from "ng2-file-upload";
import { MatButtonModule } from '@angular/material';
import { HttpService } from '../service/httpClient.service';
import { IGalleryObject } from '../model/gallery.model';
import { IGalleryImages } from '../model/gallery.model';


@Component({
  selector: 'app-smsui',
  templateUrl: './smsui.component.html',
  styleUrls: ['./smsui.component.scss']
})
export class SmsuiComponent implements OnInit {

  constructor(private http: HttpClient,private httpService: HttpService, private formBuilder: FormBuilder, private alertService: AlertService) { }

  ngOnInit() {
  }

}
