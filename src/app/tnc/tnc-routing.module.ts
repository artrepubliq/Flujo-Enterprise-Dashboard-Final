import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TncComponent } from './tnc.component';

const routes: Routes = [
  {
    path: '',
    component: TncComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TncRoutingModule { }
