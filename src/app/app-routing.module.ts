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
  { path: 'accessdenied', component: AccessdeniedComponent },
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
          { path: 'profile', component: ProfileComponent},
          { path: 'changepassword', component: ChangepasswordComponent },
          { path: '', component: AdminDashboardComponent},
          { path: 'pages', component: PagesComponent },
          { path: 'media', component: MediaComponent},
          { path: 'sociallinks', component: SocialLinksComponent},
          { path: 'smtpconfiguration', component: SMTPConfigurationComponent},
          { path: 'feedback', component: FeedbackComponent},
          { path: 'changemakerreport', component: ChangemakerComponent },
          { path: 'themeconfiguration', component: ThemeConfigComponent },
          { path: 'email', component: EmailserviceComponent},
          { path: 'sms', component: SmsuiComponent },
          { path: 'chat', component: ChatBoxComponent },
          { path: 'chat', component: ChatBoxComponent},
          { path: 'user', component: CreateUserComponentComponent },
          { path: 'media/gallery', component: ViewGalleryComponent },
          { path: 'social_management', component: SocialManagementComponent },
          { path: 'biography', component: BiographyComponent },
          { path: 'module', component: CreateModuleComponent},
          { path: 'filerepository', component: FilerepositoryComponent},
          { path: 'managereports', component: ManageReportsComponent },
          { path: 'analytics', component: AnalyticsComponent},
          { path: 'problemcategory', component: ProblemCategoryComponent },
          { path: 'areacategory', component: AreasComponent },
          { path: 'termsnconditions', component: TncComponent },
          { path: 'privacynpolicy', component: PnpComponent},
          { path: 'database', component: DatabaseComponent},
          { path: 'smsconfiguration', component: SmstemplateComponent },
          { path: 'whatsappflujo', component: WhatsappComponent },
          { path: 'emailconfiguration', component: EmailTemplateComponent, resolve: { themedata: EmailTemplateResolver }},
          { path: 'chooseplatform', component: ChooseplatformComponent },
          { path: 'socialconfiguration', component: SocialconfigurationComponent},

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
