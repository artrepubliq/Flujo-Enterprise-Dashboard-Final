import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ICommonInterface } from '../model/commonInterface.model';
import { AppConstants } from '../app.constants';
import { AnalyticsService } from './analytics.service';

@Injectable()
export class AnalyticsResolver implements Resolve<Observable<ICommonInterface>> {
    constructor (private analyticService: AnalyticsService) {}
    resolve(route: ActivatedRouteSnapshot): Observable<ICommonInterface> {
    return this.analyticService.getAnalyticsReportData('/flujo_client_getreportproblem/', AppConstants.CLIENT_ID);
    }
}
