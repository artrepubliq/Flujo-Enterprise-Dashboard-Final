import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogoComponent } from '../logo/logo.component';

export const routes: Routes = [
  {
    path: '',
    component: LogoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogoRoutingModule { }
