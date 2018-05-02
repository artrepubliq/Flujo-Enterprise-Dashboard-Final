import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ManageReportService } from '../manage-reports/manage-reports-service';
import { Observable } from 'rxjs/Observable';
import { ICommonInterface } from '../model/commonInterface.model';
import { AppConstants } from '../app.constants';

@Injectable()
export class ManageReportsResolver implements Resolve<Observable<ICommonInterface>> {
    constructor (private manageReportsService: ManageReportService) {}
    resolve(route: ActivatedRouteSnapshot): Observable<ICommonInterface> {
    return this.manageReportsService.getManageReportData('/flujo_client_getreportproblem/', AppConstants.CLIENT_ID);
    }
}
