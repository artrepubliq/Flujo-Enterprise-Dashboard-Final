import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { EmailTemplateService } from '../email-template/email-template-service';
import { AppConstants } from '../app.constants';
import { EmailThemeConfig } from '../model/emailThemeConfig.model';

@Injectable()

export class EmailTemplateResolver implements Resolve<Observable<EmailThemeConfig>> {
    constructor(private emailTemplateService: EmailTemplateService) { }
    resolve(route: ActivatedRouteSnapshot): Observable<EmailThemeConfig> {
        return this.emailTemplateService.getTemplateConfigData('/flujo_client_getemailtemplateconfig/', AppConstants.CLIENT_ID);
    }
}
