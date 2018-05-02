import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageReportsComponent } from './manage-reports.component';

const routes: Routes = [
  {
    path: '',
    component: ManageReportsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageReportsRoutingModule { }
