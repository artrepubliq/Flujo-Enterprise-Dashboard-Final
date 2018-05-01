import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SocialconfigurationComponent } from './socialconfiguration.component';

const routes: Routes = [
  {
    path: '',
    component: SocialconfigurationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SocialconfigurationRoutingModule { }
