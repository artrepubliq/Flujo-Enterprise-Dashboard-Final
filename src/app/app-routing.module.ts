import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { AdminComponent } from './admin/admin.component';
import { CallbackComponent } from './callback.component';
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
import { ViewGalleryComponent } from './view-gallery/view-gallery.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { SocialManagementComponent } from './social-management/social-management.component';
import { BiographyComponent } from './biography/biography.component';
import { ChangemakerComponent } from './changemaker/changemaker.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { FilerepositoryComponent } from './filerepository/filerepository.component';
import { ManageReportsComponent } from './manage-reports/manage-reports.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { CreateModuleComponent } from './create-module/create-module.component';
import { ProblemCategoryComponent } from './problem-category/problem-category.component';
import { AreasComponent } from './areas/areas.component';
import { TncComponent } from './tnc/tnc.component';
import { PnpComponent } from './pnp/pnp.component';
import { DatabaseComponent } from './database/database.component';
import { AccessdeniedComponent } from './accessdenied/accessdenied.component';
import { SmstemplateComponent } from './smstemplate/smstemplate.component';
import { EmailTemplateComponent } from './email-template/email-template.component';
import { ChooseplatformComponent } from './chooseplatform/chooseplatform.component';
import { EmailTemplateResolver } from './email-template/email-template.resolver';
import { SocialconfigurationComponent } from './socialconfiguration/socialconfiguration.component';
import { WhatsappComponent } from './whatsapp/whatsapp.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
    data: { title: 'Login' }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Login' }
  },

  {
    path: 'callback',
    component: CallbackComponent,
  },
  {
    path: 'accessdenied',
    component: AccessdeniedComponent,
    data: { title: 'Access Denied' }
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
          { path: 'logo', component: LogoComponent, data: { title: 'Logo' } },
          { path: 'profile', component: ProfileComponent, data: { title: 'Profile' } },
          { path: 'changepassword', component: ChangepasswordComponent, data: { title: 'Change Password' } },
          { path: '', component: AdminDashboardComponent, data: { title: 'Admin Dashboard' } },
          { path: 'pages', component: PagesComponent, data: { title: 'Pages Component' } },
          { path: 'media', component: MediaComponent, data: { title: 'Media Dashboard' } },
          { path: 'sociallinks', component: SocialLinksComponent, data: { title: 'Social links' } },
          { path: 'smtpconfiguration', component: SMTPConfigurationComponent, data: { title: 'SMTP Configuration' } },
          { path: 'feedback', component: FeedbackComponent, data: { title: 'Feedback' } },
          { path: 'changemakerreport', component: ChangemakerComponent, data: { title: 'Change Maker' } },
          { path: 'themeconfiguration', component: ThemeConfigComponent, data: { title: 'Theme Configuration' } },
          { path: 'email', component: EmailserviceComponent, data: { title: 'Email Service' } },
          { path: 'sms', component: SmsuiComponent, data: { title: 'SMS' } },
          { path: 'chat', component: ChatBoxComponent, data: { title: 'Chat Box' } },
          { path: 'chat', component: ChatBoxComponent, data: { title: 'Chat box' } },
          { path: 'user', component: CreateUserComponentComponent, data: { title: 'Create User' } },
          { path: 'media/gallery', component: ViewGalleryComponent, data: { title: 'Gallery' } },
          { path: 'social_management', component: SocialManagementComponent, data: { title: 'Socila Management' } },
          { path: 'biography', component: BiographyComponent, data: { title: 'Biography' } },
          { path: 'module', component: CreateModuleComponent, data: { title: 'Create Module' } },
          { path: 'filerepository', component: FilerepositoryComponent, data: { title: 'Drive' } },
          { path: 'managereports', component: ManageReportsComponent, data: { title: 'Manage Reports' } },
          { path: 'analytics', component: AnalyticsComponent, data: { title: 'Analytics' } },
          { path: 'problemcategory', component: ProblemCategoryComponent, data: { title: 'Problem Category' } },
          { path: 'areacategory', component: AreasComponent, data: { title: 'Areas' } },
          { path: 'termsnconditions', component: TncComponent, data: { title: 'Terms and Conditions' } },
          { path: 'privacynpolicy', component: PnpComponent, data: { title: 'Privacy and Policy' } },
          { path: 'database', component: DatabaseComponent, data: { title: 'Database' } },
          { path: 'smsconfiguration', component: SmstemplateComponent, data: { title: 'SMS Template' } },
          { path: 'whatsappflujo', component: WhatsappComponent, data: { title: 'Whatsapp' } },
          {
            path: 'emailconfiguration',
            component: EmailTemplateComponent,
            resolve: { themedata: EmailTemplateResolver },
            data: { title: 'Email template' }
          },
          { path: 'chooseplatform', component: ChooseplatformComponent, data: { title: 'Platform\'s' } },
          { path: 'socialconfiguration', component: SocialconfigurationComponent, data: { title: 'Social Configuration' } },

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
export class AppRoutingModule {
}
