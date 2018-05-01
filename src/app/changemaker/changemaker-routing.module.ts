import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangemakerComponent } from './changemaker.component';

const routes: Routes = [
  {
    path: '',
    component: ChangemakerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChangemakerRoutingModule { }
