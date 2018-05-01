import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmailserviceComponent } from './emailservice.component';

const routes: Routes = [
  {
    path: '',
    component: EmailserviceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailserviceRoutingModule { }
