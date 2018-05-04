import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

declare global {
  interface Window { cc: any; ChatCampUI: any; }
}

window.cc = window.cc || {};

window.ChatCampUI = window.ChatCampUI || {};

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
