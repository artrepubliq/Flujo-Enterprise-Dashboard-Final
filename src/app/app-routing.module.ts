import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate, LoadChildren } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { AdminComponent } from './admin/admin.component';
import { CallbackComponent } from './callback.component';
import { LoginComponent } from './login/login.component';
// import { PrivateDealsComponent } from './private-deals/private-deals.component';
import { AdminDashboardComponent } from './admin/admin-dashboard.component';
import { ProfileComponent } from './profile/profile.component';
// import { LogoComponent } from './logo/logo.component';
// import { PagesComponent } from './pages/pages.component';
// import { EmailserviceComponent } from './emailservice/emailservice.component';
// import { SocialLinksComponent } from './sociallinks/sociallinks.component';
// import { SMTPConfigurationComponent } from './smtpconfiguration/smtpconfiguration.component';
import { ChatBoxComponent } from './chat-box/chat-box.component';
// import { MediaComponent } from './media/media.component';
import { SmsuiComponent } from './smsui/smsui.component';
import { CreateUserComponentComponent } from './create-user-component/create-user-component.component';
// import { ThemeConfigComponent } from './theme-config/theme-config.component';
import { ViewGalleryComponent } from './view-gallery/view-gallery.component';
// import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { SocialManagementComponent } from './social-management/social-management.component';
import { BiographyComponent } from './biography/biography.component';
import { ChangemakerComponent } from './changemaker/changemaker.component';
import { FeedbackComponent } from './feedback/feedback.component';
// import { FilerepositoryComponent } from './filerepository/filerepository.component';
// import { ManageReportsComponent } from './manage-reports/manage-reports.component';
import { AnalyticsComponent } from './analytics/analytics.component';
// import { CreateModuleComponent } from './create-module/create-module.component';
// import { ProblemCategoryComponent } from './problem-category/problem-category.component';
import { AreasComponent } from './areas/areas.component';
// import { TncComponent } from './tnc/tnc.component';
// import { PnpComponent } from './pnp/pnp.component';
import { DatabaseComponent } from './database/database.component';
import { AccessdeniedComponent } from './accessdenied/accessdenied.component';
// import { SmstemplateComponent } from './smstemplate/smstemplate.component';
import { EmailTemplateComponent } from './email-template/email-template.component';
import { ChooseplatformComponent } from './chooseplatform/chooseplatform.component';
import { EmailTemplateResolver } from './email-template/email-template.resolver';
// import { SocialconfigurationComponent } from './socialconfiguration/socialconfiguration.component';
import { WhatsappComponent } from './whatsapp/whatsapp.component';
import { ManageReportsResolver } from './manage-reports/manage-reports-resolver';
import { FeedbackResolver } from './feedback/feedback-resolver';
import { DataBaseResolver } from './database/database-resolver';
import { SocialLoginComponent } from './social-login/social-login.component';
import { EmailConfigService } from './service/email-config.service';
import { EmailConfigComponent } from './email-config/email-config.component';
import { DomainManagementComponent } from './domain/domain-management/domain-management.component';
import { BASE_ROUTER_CONFIG } from './app.router-contstants';

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
          {
            path: `${BASE_ROUTER_CONFIG.F_11_SF_5.token}`,
            loadChildren: './logo/logo.module#LogoModule',
            data: { title: BASE_ROUTER_CONFIG.F_11_SF_2.title }
          },
          {
            path: `${BASE_ROUTER_CONFIG.F_11_SF_1.token}`, component: ProfileComponent,
            data: { title: BASE_ROUTER_CONFIG.F_11_SF_1.title }
          },
          {
            path: `${BASE_ROUTER_CONFIG.F_11_SF_2.token}`, loadChildren: './changepassword/changepassword.module#ChangepasswordModule',
            data: { title: BASE_ROUTER_CONFIG.F_11_SF_2.title }
          },
          { path: '', component: AdminDashboardComponent, data: { title: 'Admin Dashboard' } },
          {
            path: `${BASE_ROUTER_CONFIG.F_2_SF_9.token}`, loadChildren: './pages/pages.module#PagesModule',
            data: { title: BASE_ROUTER_CONFIG.F_2_SF_9.title }
          },
          {
            path: `${BASE_ROUTER_CONFIG.F_2_SF_10.token}`, loadChildren: './media/media.module#MediaModule',
            data: { title:  BASE_ROUTER_CONFIG.F_2_SF_10.title}
          },
          {
            path: `${BASE_ROUTER_CONFIG.F_2_SF_2.token}`, loadChildren: './sociallinks/sociallinks.module#SociallinksModule',
            data: { title: BASE_ROUTER_CONFIG.F_2_SF_2.title }
          },
          // {
          //   path: 'smtpconfiguration', loadChildren: './smtpconfiguration/smtpconfiguration.module#SmtpconfigurationModule',
          //   data: { title: 'SMTP Configuration' }
          // },
          {
            path: `${BASE_ROUTER_CONFIG.F_2_SF_11.token}`, component: FeedbackComponent,
            resolve: { feedbackReportData: FeedbackResolver },
            data: { title: BASE_ROUTER_CONFIG.F_2_SF_11.title }
          },
          { path: `${BASE_ROUTER_CONFIG.F_2_SF_12.token}`, component: ChangemakerComponent,
            data: { title: BASE_ROUTER_CONFIG.F_2_SF_12.title } },
          {
            path: `${BASE_ROUTER_CONFIG.F_2_SF_1.token}`, loadChildren: './theme-config/theme-config.module#ThemeConfigModule',
            data: { title: BASE_ROUTER_CONFIG.F_2_SF_1.title }
          },
          {
            path: `${BASE_ROUTER_CONFIG.F_4_SF_1.token}`, component: EmailConfigComponent,
            data: { title: BASE_ROUTER_CONFIG.F_4_SF_1 }
          },
          {
            path: `${BASE_ROUTER_CONFIG.F_5_SF_1}`, loadChildren: './smsui/smsui.module#SmsuiModule',
            data: { title: BASE_ROUTER_CONFIG.F_5_SF_1.title }
          },
          { path: `${BASE_ROUTER_CONFIG.F_10_SF_1.token}`, component: ChatBoxComponent,
            data: { title: BASE_ROUTER_CONFIG.F_10_SF_1.title } },
          {
             // tslint:disable-next-line:max-line-length
            path: `${BASE_ROUTER_CONFIG.F_11_SF_3.token}`, loadChildren: './create-user-component/create-user-component.module#CreateUserComponentModule',
            data: { title: BASE_ROUTER_CONFIG.F_11_SF_3.title }
          },
          {
            path: `${BASE_ROUTER_CONFIG.F_2_SF_13.token}`, component: ViewGalleryComponent,
            data: { title: BASE_ROUTER_CONFIG.F_2_SF_13.title }
          },
          { path: `${BASE_ROUTER_CONFIG.F_3_SF_1.token}` + '/:id', component: SocialManagementComponent,
            data: { title: BASE_ROUTER_CONFIG.F_3_SF_1.title} },
          { path: `${BASE_ROUTER_CONFIG.F_3.token}`, component: SocialLoginComponent,
              data: { title: BASE_ROUTER_CONFIG.F_3_SF_2.title } },

          { path: `${BASE_ROUTER_CONFIG.F_2_SF_3.token}`, loadChildren: './biography/biography.module#BiographyModule',
            data: { title: BASE_ROUTER_CONFIG.F_2_SF_3.title } },
          {
            path: `${BASE_ROUTER_CONFIG.F_2_SF_4.token}`,
            loadChildren: 'app/create-module/create-module.module#CreateModuleModule',
            data: { title: BASE_ROUTER_CONFIG.F_2_SF_4.title }
          },
          {
            path: `${BASE_ROUTER_CONFIG.F_9_SF_1.token}`, loadChildren: './filerepository/filerepository.module#FilerepositoryModule',
            data: { title: BASE_ROUTER_CONFIG.F_9_SF_1.title }
          },
          {
            path: `${BASE_ROUTER_CONFIG.F_2_SF_14.token}`, loadChildren: './manage-reports/manage-reports.module#ManageReportsModule',
            resolve: { reportData: ManageReportsResolver },
            data: { title: BASE_ROUTER_CONFIG.F_2_SF_14.title }
          },
          { path: `${BASE_ROUTER_CONFIG.F_8_SF_1.token}`, component: AnalyticsComponent,
              data: { title: BASE_ROUTER_CONFIG.F_8_SF_1.title } },
          {
            path: `${BASE_ROUTER_CONFIG.F_11_SF_4.token}`,
            component: DomainManagementComponent,
            data: { title: BASE_ROUTER_CONFIG.F_11_SF_4.title }
          },
          {
            path: `${BASE_ROUTER_CONFIG.F_2_SF_7.token}`, loadChildren: './problem-category/problem-category.module#ProblemCategoryModule',
            data: { title: BASE_ROUTER_CONFIG.F_2_SF_7.title }
          },
          { path: `${BASE_ROUTER_CONFIG.F_2_SF_8.token}`, component: AreasComponent, data: { title: BASE_ROUTER_CONFIG.F_2_SF_8.title } },
          {
            path: `${BASE_ROUTER_CONFIG.F_2_SF_5.token}`, loadChildren: './tnc/tnc.module#TncModule',
            data: { title: BASE_ROUTER_CONFIG.F_2_SF_5.title }
          },
          {
            path: `${BASE_ROUTER_CONFIG.F_2_SF_6.token}`, loadChildren: './pnp/pnp.module#PnpModule',
            data: { title: BASE_ROUTER_CONFIG.F_2_SF_6.title }
          },
          {
            path: `${BASE_ROUTER_CONFIG.F_2_SF_15.token}`, component: DatabaseComponent,
            resolve: { databaseReportData: DataBaseResolver },
            data: { title: BASE_ROUTER_CONFIG.F_2_SF_15.title }
          },
          {
            path: `${BASE_ROUTER_CONFIG.F_5_SF_2.token}`, loadChildren: './smstemplate/smstemplate.module#SmstemplateModule',
            data: { title: BASE_ROUTER_CONFIG.F_2_SF_5.title }
          },
          {
            path: `${BASE_ROUTER_CONFIG.F_6_SF_1.token}`, loadChildren: './whatsapp/whatsapp.module#WhatsappModule',
            data: { title: BASE_ROUTER_CONFIG.F_6_SF_1.title }
          },
          {
            path: `${BASE_ROUTER_CONFIG.F_4_SF_2.token}`,
            component: EmailTemplateComponent,
            resolve: { themedata: EmailTemplateResolver },
            data: { title: BASE_ROUTER_CONFIG.F_4_SF_2.title }
          },
          {
            path: `${BASE_ROUTER_CONFIG.F_2_SF_16.token}`, loadChildren: './chooseplatform/chooseplatform.module#ChooseplatformModule',
            data: { title: BASE_ROUTER_CONFIG.F_2_SF_16.title }
          },
          // {
          //   path: BASE_ROUTER_C loadChildren: './socialconfiguration/socialconfiguration.module#SocialconfigurationModule',
          //   data: { title: 'Social Configuration' }
          // },

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


// {
//   path: 'logo',
//   loadChildren: './logo/logo.module#LogoModule',
//   data: { title: 'Logo' }
// },
// {
//   path: 'profile', component: ProfileComponent,
//   data: { title: 'Profile' }
// },
// {
//   path: 'changepassword', loadChildren: './changepassword/changepassword.module#ChangepasswordModule',
//   data: { title: 'Change Password' }
// },
// { path: '', component: AdminDashboardComponent, data: { title: 'Admin Dashboard' } },
// {
//   path: 'pages', loadChildren: './pages/pages.module#PagesModule',
//   data: { title: 'Pages Component' }
// },
// {
//   path: 'media', loadChildren: './media/media.module#MediaModule',
//   data: { title: 'Media Dashboard' }
// },
// {
//   path: 'sociallinks', loadChildren: './sociallinks/sociallinks.module#SociallinksModule',
//   data: { title: 'Social links' }
// },
// {
//   path: 'smtpconfiguration', loadChildren: './smtpconfiguration/smtpconfiguration.module#SmtpconfigurationModule',
//   data: { title: 'SMTP Configuration' }
// },
// {
//   path: 'feedback', component: FeedbackComponent,
//   resolve: { feedbackReportData: FeedbackResolver },
//   data: { title: 'Feedback' }
// },
// { path: 'changemakerreport', component: ChangemakerComponent, data: { title: 'Change Maker' } },
// {
//   path: 'themeconfiguration', loadChildren: './theme-config/theme-config.module#ThemeConfigModule',
//   data: { title: 'Theme Configuration' }
// },
// {
//   path: 'emailconfig', loadChildren: './emailservice/emailservice.module#EmailserviceModule',
//   data: { title: 'Email Service' }
// },
// {
//   path: 'email', component: EmailConfigComponent,
//   data: { title: 'Email Service' }
// },
// {
//   path: 'sms', loadChildren: './smsui/smsui.module#SmsuiModule',
//   data: { title: 'SMS' }
// },
// { path: 'chat', component: ChatBoxComponent, data: { title: 'Chat Box' } },
// { path: 'chat', component: ChatBoxComponent, data: { title: 'Chat box' } },
// {
//   path: 'user', loadChildren: './create-user-component/create-user-component.module#CreateUserComponentModule',
//   data: { title: 'Create User' }
// },
// {
//   path: 'media/gallery', component: ViewGalleryComponent,
//   data: { title: 'Gallery' }
// },
// { path: 'social_management/:id', component: SocialManagementComponent, data: { title: 'Social Management' } },
// { path: 'social_login', component: SocialLoginComponent, data: { title: 'Social Login' } },
// { path: 'biography', loadChildren: './biography/biography.module#BiographyModule', data: { title: 'Biography' } },
// {
//   path: 'module',
//   loadChildren: 'app/create-module/create-module.module#CreateModuleModule',
//   data: { title: 'Create Module' }
// },
// {
//   path: 'filerepository', loadChildren: './filerepository/filerepository.module#FilerepositoryModule',
//   data: { title: 'Drive' }
// },
// {
//   path: 'managereports', loadChildren: './manage-reports/manage-reports.module#ManageReportsModule',
//   resolve: { reportData: ManageReportsResolver },
//   data: { title: 'Manage Reports' }
// },
// { path: 'analytics', component: AnalyticsComponent, data: { title: 'Analytics' } },
// {
//   path: 'domain',
//   component: DomainManagementComponent,
//   data: { title: 'Domain Management' }
// },
// {
//   path: 'problemcategory', loadChildren: './problem-category/problem-category.module#ProblemCategoryModule',
//   data: { title: 'Problem Category' }
// },
// { path: 'areacategory', component: AreasComponent, data: { title: 'Areas' } },
// {
//   path: 'termsnconditions', loadChildren: './tnc/tnc.module#TncModule',
//   data: { title: 'Terms and Conditions' }
// },
// {
//   path: 'privacynpolicy', loadChildren: './pnp/pnp.module#PnpModule',
//   data: { title: 'Privacy and Policy' }
// },
// {
//   path: 'database', component: DatabaseComponent,
//   resolve: { databaseReportData: DataBaseResolver },
//   data: { title: 'Database' }
// },
// {
//   path: 'smsconfiguration', loadChildren: './smstemplate/smstemplate.module#SmstemplateModule',
//   data: { title: 'SMS Template' }
// },
// {
//   path: 'whatsappflujo', loadChildren: './whatsapp/whatsapp.module#WhatsappModule',
//   data: { title: 'Whatsapp' }
// },
// {
//   path: 'emailconfiguration',
//   component: EmailTemplateComponent,
//   resolve: { themedata: EmailTemplateResolver },
//   data: { title: 'Email template' }
// },
// {
//   path: 'chooseplatform', loadChildren: './chooseplatform/chooseplatform.module#ChooseplatformModule',
//   data: { title: 'Platform\'s' }
// },
// {
//   path: 'socialconfiguration', loadChildren: './socialconfiguration/socialconfiguration.module#SocialconfigurationModule',
//   data: { title: 'Social Configuration' }
// },
