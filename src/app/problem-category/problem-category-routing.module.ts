import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProblemCategoryComponent } from './problem-category.component';

const routes: Routes = [
  {
    path: '',
    component: ProblemCategoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProblemCategoryRoutingModule { }
