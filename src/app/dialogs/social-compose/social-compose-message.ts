import { Inject, Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ITwitterUserProfile, ITwitUser } from '../../model/twitter/twitter.model';
import { FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'message-compose',
    templateUrl: 'social-compose-message.html',
    styleUrls: ['social-compose-message.scss']
})
// tslint:disable-next-line:component-class-suffix
export class MessageCompose implements OnInit {
    checkboxGroup: FormArray;
    doSchedule: true;
    postStatusForm: any;
    constructor(
        public dialogRef: MatDialogRef<MessageCompose>,
        @Inject(MAT_DIALOG_DATA) public data: ITwitUser,
        private formBuilder: FormBuilder
    ) {
        this.postStatusForm = this.formBuilder.group({
            'postStatus': ['', Validators.compose([Validators.required])],
        });

        // this.checkboxGroup = new FormArray(this.data.map(item => new FormGroup({
        //     id: new FormControl(item.key),
        //     text: new FormControl(item.text),
        //     checkbox: new FormControl(false)
        //   })));
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnInit(): void {
        console.log(this.data);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

    public onCheckEvent(event): void {
        console.log(event.target.checked);
    }

    public postSocialStatus(): void {
        this.dialogRef.close(this.postStatusForm.value);
        console.log(this.postStatusForm.value);
    }

}
