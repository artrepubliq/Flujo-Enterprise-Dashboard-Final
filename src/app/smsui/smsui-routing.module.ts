import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SmsuiComponent } from './smsui.component';

const routes: Routes = [
  {
    path: '',
    component: SmsuiComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmsuiRoutingModule { }
