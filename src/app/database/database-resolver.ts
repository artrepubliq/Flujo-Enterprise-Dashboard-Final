import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ICommonInterface } from '../model/commonInterface.model';
import { Observable } from 'rxjs/Observable';
import { DataBaseService } from './database-service';
import { AppConstants } from '../app.constants';
@Injectable()
export class DataBaseResolver implements Resolve<Observable<ICommonInterface>> {
constructor (private dataBaseService: DataBaseService) {}
resolve(route: ActivatedRouteSnapshot): Observable<ICommonInterface> {
    return this.dataBaseService.getDataBaseData('flujo_client_getdata/', AppConstants.CLIENT_ID);
}
}
