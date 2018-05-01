import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateUserComponentComponent } from './create-user-component.component';

const routes: Routes = [
  {
    path: '',
    component: CreateUserComponentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateUserComponentRoutingModule { }
