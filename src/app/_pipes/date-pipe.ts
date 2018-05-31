import { Pipe } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
// import { Moment } from 'moment';
// tslint:disable-next-line:use-pipe-transform-interface
@Pipe({
    name: 'myDate',
    pure: true
})
export class MyDatePipe extends DatePipe {
    transform(value: any, pattern: string = 'mediumDate'): string | null {
        const result =  moment(value).fromNow();
        return result;
    }
}
