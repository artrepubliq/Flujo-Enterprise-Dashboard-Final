import { Component, OnInit, Inject, Injectable } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
@Component({
    selector: 'app-edit-gallery',
    templateUrl: './editgallery.popup.html',
    styleUrls: ['./editgallery.popup.scss']
  })
  // tslint:disable-next-line:component-class-suffix
  export class EditGalleryItems {
  image: any;
  albumItem: any;
  oreder: string;
  loadingSave = false;
  albumItemForm: FormGroup;

  constructor(private formBuilder: FormBuilder , public dialogRef: MatDialogRef<EditGalleryItems>,
     @Inject(MAT_DIALOG_DATA) public data: any) {
       console.log(this.data);
      this.albumItemForm = this.formBuilder.group({
        media_id: [null],
        title: ['', Validators.required],
        description: ['', Validators.required],
        order: ['', Validators.required],
      });
      this.albumItemForm.controls['media_id'].setValue(data[0].media_id);
      this.albumItemForm.controls['title'].setValue(data[0].title);
      this.albumItemForm.controls['description'].setValue(data[0].description);
      this.albumItemForm.controls['order'].setValue(data[0].order);
      this.image = data[0].images;

 }
 onSubmit(data) {
    this.dialogRef.close(data);
 }

}
