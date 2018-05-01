import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ICommonInterface } from '../model/commonInterface.model';
import { FeedbackService } from './feedback-service';
import { AppConstants } from '../app.constants';

@Injectable()
export class FeedbackResolver implements Resolve<Observable<ICommonInterface>> {
    constructor(private feedbackService: FeedbackService) { }
    resolve(route: ActivatedRouteSnapshot): Observable<ICommonInterface> {
        return this.feedbackService.getFeedback('/flujo_client_getfeedback/', AppConstants.CLIENT_ID);
    }
}
