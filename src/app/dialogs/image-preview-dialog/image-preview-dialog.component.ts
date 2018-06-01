import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

/**
 * @title Dialog Overview
 */
@Component({
  selector: 'app-image-preview-dialog',
  templateUrl: './image-preview-dialog.component.html',
  styleUrls: ['./image-preview-dialog.component.scss']
})

export class ImagePreviewDialogComponent implements OnInit {
  public index = 0;
  public image: string;
  constructor(
    public dialogRef: MatDialogRef<ImagePreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Array<any>) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    if (this.data && this.data[this.index]) {
      console.log(this.data);
      this.image = this.data[this.index];
    }
    console.log(this.data);
  }

  /**
   * this is to display previous image
   * @param index this recieves index number of current index
   */
  public previous(index: number): boolean {
    if (index <= 0) {
      return false;
    } else {
      this.index = index - 1;
      this.image = this.data[this.index];
      if (this.image === undefined) {
        return false;
      }
    }
    console.log(this.image);
  }

  /**
   * this is to display next image
   * @param index this recieves index number of current index
   */
  public next(index: number): boolean {
    if (index >= (this.data.length - 1)) {
      return false;
    } else {
      this.index = index + 1;
      this.image = this.data[this.index];
      if (this.image === undefined) {
        return false;
      }
    }
    console.log(this.image);
  }

}
