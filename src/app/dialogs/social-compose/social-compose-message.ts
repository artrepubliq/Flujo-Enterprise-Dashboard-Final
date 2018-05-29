import { Inject, Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ITwitterUserProfile, ITwitUser } from '../../model/twitter/twitter.model';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
// import { FlujodatepickerDirective } from '../../flujodatepicker.directive';
import * as moment from 'moment';
import * as $ from 'jquery';
window['jQuery'] = window['$'] = $;
// import 'eonasdan-bootstrap-datetimepicker/src/js/bootstrap-datetimepicker.js';
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'message-compose',
    templateUrl: 'social-compose-message.html',
    styleUrls: ['social-compose-message.scss']
})
// tslint:disable-next-line:component-class-suffix
export class MessageCompose implements OnInit {
    checkboxGroup: FormArray;
    doSchedule: boolean;
    postStatusForm: any;
    // format: 'LT';
    // pickTime: true;
    // startDate =  moment('2015-11-18T00:00Z');
    // endDate = moment('2015-11-20T00:00Z');
    // startOptions: any = {format: 'YYYY-MM-DD'};
    // endOptions: any = {format: 'YYYY-MM-DD'};
    // public startDate: any = new Date();
    public date: Date = new Date();
    // settings = {
    //     bigBanner: true,
    //     timePicker: true,
    //     format: 'dd-MM-yyyy hh:mm',
    //     defaultOpen: false,
    //     closeOnSelect: true,
    //     rangepicker: false,
    //     clickOutside: false
    // };
    settings = {
        bigBanner: true,
        timePicker: true,
        format: 'dd-MM-yyyy hh:mm',
        defaultOpen: false,
        closeOnSelect: true,
        rangepicker: false,
    };
    constructor(
        public dialogRef: MatDialogRef<MessageCompose>,
        @Inject(MAT_DIALOG_DATA) public data: ITwitUser,
        private formBuilder: FormBuilder
    ) {
        this.postStatusForm = this.formBuilder.group({
            'postStatus': ['', Validators.compose([Validators.required])],
        });
        this.doSchedule = false;
        // this.checkboxGroup = new FormArray(this.data.map(item => new FormGroup({
        //     id: new FormControl(item.key),
        //     text: new FormControl(item.text),
        //     checkbox: new FormControl(false)
        //   })));
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnInit(): void {
        console.log(this.data);
        // this.endOptions.minDate = this.startDate;
        // this.startOptions.maxDate = this.endDate;
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

    public scheduleCheckBox(event): void {
        if (event.target.checked) {
            this.doSchedule = true;
        } else {
            this.doSchedule = false;
        }
        console.log(event.target.checked);
    }
    // public update() {
    //     this.startOptions.maxDate = this.endDate;
    //     this.endOptions.minDate = this.startDate;
    //   }

    // public onStartDateChange(date) {
    //     this.startDate = Date;
    //     this.startDate = new Date(this.startDate.toISOString());
    // }
}
