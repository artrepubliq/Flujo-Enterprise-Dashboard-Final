import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-view-gallery',
  templateUrl: './view-gallery.component.html',
  styleUrls: ['./view-gallery.component.scss']
})
export class ViewGalleryComponent implements OnInit {

  
  constructor(public dialog: MatDialog) {}

  close:string;

  openDialog(): void {
    let dialogRef = this.dialog.open(EditGalleryItems, {
      // width: '250px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.close = result;
    });
  }

  ngOnInit() {
  }

  images = [
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

@Component({
  selector: 'edit-gallery',
  templateUrl: './edit-gallery-item.html',
  styleUrls: ['./view-gallery.component.scss']
})
export class EditGalleryItems {

  constructor(
    public dialogRef: MatDialogRef<EditGalleryItems>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}