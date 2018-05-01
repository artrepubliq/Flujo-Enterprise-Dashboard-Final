import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FilerepositoryComponent } from './filerepository.component';

const routes: Routes = [
  {
    path: '',
    component: FilerepositoryComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FilerepositoryRoutingModule { }
