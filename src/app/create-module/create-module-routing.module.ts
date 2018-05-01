import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateModuleComponent } from './create-module.component';
import { CommonModule } from '@angular/common';
const routes: Routes = [
  {
    path: '',
    component: CreateModuleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateModuleRoutingModule { }
