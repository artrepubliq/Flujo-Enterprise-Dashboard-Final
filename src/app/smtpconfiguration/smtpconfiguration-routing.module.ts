import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SMTPConfigurationComponent } from './smtpconfiguration.component';

const routes: Routes = [
  {
    path: '',
    component: SMTPConfigurationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmtpconfigurationRoutingModule { }
