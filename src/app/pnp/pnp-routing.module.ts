import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PnpComponent } from './pnp.component';

const routes: Routes = [
  {
    path: '',
    component: PnpComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PnpRoutingModule { }
