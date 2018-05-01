import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WhatsappComponent } from './whatsapp.component';

const routes: Routes = [
  {
    path: '',
    component: WhatsappComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WhatsappRoutingModule { }
