import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { MediaComponent } from "../../media/media.component";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import { HttpClient } from "@angular/common/http";
import { AlertService } from "ngx-alerts";
@Component({
  selector: 'gallery-directive',
  templateUrl: './gallery.directive.html',
  styleUrls: ['./gallery.directive.scss']
})
export class GalleryDirective implements OnInit {
  mediaComponent: MediaComponent;
  constructor(public dialog: MatDialog, private spinnerService: Ng4LoadingSpinnerService, private httpClient: HttpClient, private formBuilder: FormBuilder, private alertService: AlertService) {
  // constructor(private matDialog: MatDialog, private formBuilder: FormBuilder ){
    this.mediaComponent = new MediaComponent(dialog ,spinnerService,httpClient,formBuilder,alertService);
  }
  
  @Input() albumBase64imagesArray: any;
  ngOnInit() {
    
  }
  deleteGalleryItem(){
    console.log("closse dialog");
  }
  openDialog(albumItem){
    this.mediaComponent.openDialog(albumItem);
    console.log("test"+albumItem);
  }
  
}
