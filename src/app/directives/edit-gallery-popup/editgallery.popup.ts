import { Component, OnInit, Inject, Injectable } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
@Component({
    selector: 'edit-gallery',
    templateUrl: './editgallery.popup.html',
    styleUrls: ['./editgallery.popup.scss']
  })
  export class EditGalleryItems {
  albumItem: any;
  oreder: string;
  
  loadingSave: boolean = false;
  albumItemForm: FormGroup;

  constructor(private formBuilder: FormBuilder ,public dialogRef: MatDialogRef<EditGalleryItems>,
     @Inject(MAT_DIALOG_DATA) public data: any) {
    
    
      this.albumItemForm = this.formBuilder.group({
        id: [null],
        title: ['', Validators.required],
        description: ['', Validators.required],
        order: ['', Validators.required],
       image: [null],
      });
      this.albumItemForm.controls['id'].setValue(data[0].id);
      this.albumItemForm.controls['title'].setValue(data[0].title);
      this.albumItemForm.controls['description'].setValue(data[0].description);
      this.albumItemForm.controls['order'].setValue(data[0].order);
      this.albumItemForm.controls['image'].setValue(data[0].image);

 }  
 onSubmit(data){
     
    this.dialogRef.close(data);
    
 }

}