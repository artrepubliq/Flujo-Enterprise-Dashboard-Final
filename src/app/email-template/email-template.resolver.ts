import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { EmailTemplateService } from '../email-template/email-template-service';
import { AppConstants } from '../app.constants';
import { IPostEmailTemplate } from '../model/emailThemeConfig.model';
import { ICommonInterface } from '../model/commonInterface.model';

@Injectable()
export class EmailTemplateResolver implements Resolve<Observable<ICommonInterface>> {
    constructor(private emailTemplateService: EmailTemplateService) { }
    resolve(route: ActivatedRouteSnapshot): Observable<ICommonInterface> {
        return this.emailTemplateService.getTemplateConfigData('flujo_client_getemailtemplateconfig/', AppConstants.CLIENT_ID);
    }
}
