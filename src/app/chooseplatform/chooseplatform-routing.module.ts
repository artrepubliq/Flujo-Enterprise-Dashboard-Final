import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChooseplatformComponent } from './chooseplatform.component';

const routes: Routes = [
  {
    path: '',
    component: ChooseplatformComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChooseplatformRoutingModule { }
