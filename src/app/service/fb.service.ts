import { Injectable } from '@angular/core';
import { FacebookService, InitParams } from 'ngx-facebook/dist/esm';

@Injectable()
export class FBService {

    constructor(private fb: FacebookService) {

}

FBInit = () => {
    const initParams: InitParams = {
        appId: '208023236649331', // 149056292450936
        xfbml: true,
        version: 'v3.0'
      };

      this.fb.init(initParams);
  }
}

