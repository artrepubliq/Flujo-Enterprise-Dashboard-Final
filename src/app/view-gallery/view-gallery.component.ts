import { OnInit, Inject, Component, ViewChild, TemplateRef, ViewContainerRef } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { EditGalleryItems } from '../directives/edit-gallery-popup/editgallery.popup';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
@Component({
  selector: 'app-view-gallery',
  templateUrl: './view-gallery.component.html',
  styleUrls: ['./view-gallery.component.scss']
})
export class ViewGalleryComponent implements OnInit { 
  albumItemForm: FormGroup;
  albumItem: any;
  constructor(private formBuilder: FormBuilder , public dialog: MatDialog) {
    this.albumItemForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      order: ['', Validators.required]
    });
  }

  close:string;

  openDialog(albumItem): void {
    
   this.albumItem = albumItem;
    let dialogRef = this.dialog.open(EditGalleryItems, {
      data: this.albumItem
      // height: "400px",
      // width:"600px"
    });
     dialogRef.afterClosed().subscribe(result => {
      console.log("eshwar"+result);      
    });
  }

  ngOnInit() {
  }

  albumImages = [
    { name: 'Title', imagesUer: 'profile_user.jpg'},
    { name: 'Title', imagesUer: 'profile_user.jpg'},
    { name: 'Title', imagesUer: 'profile_user.jpg'},
    { name: 'Title', imagesUer: 'profile_user.jpg'},
    { name: 'Title', imagesUer: 'profile_user.jpg'},
    { name: 'Title', imagesUer: 'profile_user.jpg'},
    { name: 'Title', imagesUer: 'profile_user.jpg'},
    { name: 'Title', imagesUer: 'profile_user.jpg'},
    { name: 'Title', imagesUer: 'profile_user.jpg'},
    { name: 'Title', imagesUer: 'profile_user.jpg'},
    { name: 'Title', imagesUer: 'profile_user.jpg'},
    { name: 'Title', imagesUer: 'profile_user.jpg'},
    { name: 'Title', imagesUer: 'profile_user.jpg'},
    { name: 'Title', imagesUer: 'profile_user.jpg'},
    { name: 'Title', imagesUer: 'profile_user.jpg'},
    { name: 'Title', imagesUer: 'profile_user.jpg'}
  ]


}

