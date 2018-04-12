import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MediaComponent } from '../../media/media.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { HttpClient } from '@angular/common/http';
import { AlertService } from 'ngx-alerts';
import { AdminComponent } from '../../admin/admin.component';
import { Router } from '@angular/router';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'gallery-directive',
  templateUrl: './gallery.directive.html',
  styleUrls: ['./gallery.directive.scss']
})
// tslint:disable-next-line:component-class-suffix
export class GalleryDirective implements OnInit {
  mediaComponent: MediaComponent;
  constructor(public dialog: MatDialog, private spinnerService: Ng4LoadingSpinnerService,
  private httpClient: HttpClient, private formBuilder: FormBuilder, private alertService: AlertService,
  private router: Router, public adminComponent: AdminComponent) {
  // constructor(private matDialog: MatDialog, private formBuilder: FormBuilder ){
<<<<<<< HEAD
    this.mediaComponent = new MediaComponent(dialog , spinnerService, httpClient, formBuilder, alertService, router, adminComponent);
=======
    this.mediaComponent = new MediaComponent( dialog, spinnerService, httpClient, formBuilder, alertService, router, adminComponent);
>>>>>>> 73e15f6ea724dd71edd31456e5e2104571108c53
  }
  @Input() albumBase64imagesArray: any;
  ngOnInit() {
  }
  deleteGalleryItem() {
    console.log('closse dialog');
  }
  openDialog(albumItem) {
    this.mediaComponent.openDialog(albumItem);
    console.log('test' + albumItem);
  }

}
