import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { AdminComponent } from './admin/admin.component';
import { CallbackComponent } from './callback.component';
import { ReportsComponent } from './reports/reports.component';
import { LoginComponent } from './login/login.component';
// import { PrivateDealsComponent } from './private-deals/private-deals.component';
import { AdminDashboardComponent } from './admin/admin-dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { LogoComponent } from './logo/logo.component';
import { PagesComponent } from './pages/pages.component';
import { EmailserviceComponent } from './emailservice/emailservice.component';
import { SocialLinksComponent } from './sociallinks/sociallinks.component';
import { SMTPConfigurationComponent } from './smtpconfiguration/smtpconfiguration.component';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { MediaComponent } from './media/media.component';
import { SmsuiComponent } from './smsui/smsui.component';
import { CreateUserComponentComponent } from './create-user-component/create-user-component.component';
import { ThemeConfigComponent } from './theme-config/theme-config.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  
  {
    path: 'callback',
    component: CallbackComponent
  },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: '',
        canActivate: [
          AuthGuard
        ],
        children: [
          { path: 'logo', component: LogoComponent },
          { path: 'profile', component: ProfileComponent },
          { path: '', component: AdminDashboardComponent },
          { path: 'pages', component: PagesComponent },
          { path: 'media', component: MediaComponent },
          { path: 'sociallinks', component: SocialLinksComponent },
          { path: 'smtpconfiguration', component: SMTPConfigurationComponent },
          { path: 'reports', component: ReportsComponent },
          { path: 'themeconfiguration', component: ThemeConfigComponent },
          { path: 'email', component: EmailserviceComponent },

          { path: 'sms', component: SmsuiComponent},
          { path: 'chat', component: ChatBoxComponent },
          { path: 'chat', component: ChatBoxComponent },
          { path: 'user', component: CreateUserComponentComponent },
        ]
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule { }