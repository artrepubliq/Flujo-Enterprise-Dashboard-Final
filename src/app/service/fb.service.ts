import { Injectable } from '@angular/core';
import { FacebookService, InitParams } from 'ngx-facebook/dist/esm';

@Injectable()
export class FBService {

    constructor(private fb: FacebookService) {

}

FBInit = () => {
    const initParams: InitParams = {
        appId: '149056292450936',
        xfbml: true,
        version: 'v2.12'
      };

      this.fb.init(initParams);
  }
}

