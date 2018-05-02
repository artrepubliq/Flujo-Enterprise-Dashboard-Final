import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ThemeConfigComponent } from './theme-config.component';

const routes: Routes = [
  {
    path: '',
    component: ThemeConfigComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThemeConfigRoutingModule { }
