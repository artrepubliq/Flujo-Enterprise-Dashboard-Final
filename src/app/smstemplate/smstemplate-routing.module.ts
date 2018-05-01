import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SmstemplateComponent } from './smstemplate.component';

const routes: Routes = [
  {
    path: '',
    component: SmstemplateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmstemplateRoutingModule { }
