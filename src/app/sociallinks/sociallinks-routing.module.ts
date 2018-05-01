import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SocialLinksComponent } from './sociallinks.component';

const routes: Routes = [
  {
    path: '',
    component: SocialLinksComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SociallinksRoutingModule { }
