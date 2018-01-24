import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AlertModule } from 'ngx-alerts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { CallbackComponent } from './callback.component';
import { AuthService } from './auth/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagesComponent } from './pages/pages.component';
import { HttpService } from './service/httpClient.service'
import { AdminDashboardComponent } from './admin/admin-dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { LogoComponent } from './logo/logo.component';
import { AdminComponent } from './admin/admin.component';
import { CKEditorModule } from 'ngx-ckeditor';
import { ValidationService } from './service/validation.service';
import { SocialLinksComponent } from './sociallinks/sociallinks.component';
import { SMTPConfigurationComponent } from './smtpconfiguration/smtpconfiguration.component';
import { ReportsComponent } from './reports/reports.component';

//directives
import { ControlMessagesComponent } from './directives/control-messages.component';
import { EmailserviceComponent } from './emailservice/emailservice.component';
import { MatButtonModule } from '@angular/material';

// Angular Flex Layout
import { FlexLayoutModule } from '@angular/flex-layout';

// Perfect Scroll Bar
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { CreateUserComponentComponent } from './create-user-component/create-user-component.component';
import { ThemeConfigComponent } from './theme-config/theme-config.component';
import { ColorPickerModule } from 'ngx-color-picker';
const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CallbackComponent,
    LogoComponent,
    ProfileComponent,
    AdminDashboardComponent,
    AdminComponent,
    PagesComponent,
    SocialLinksComponent,
    ControlMessagesComponent,
    SMTPConfigurationComponent,
    ReportsComponent,
    EmailserviceComponent,
    ChatBoxComponent,
    CreateUserComponentComponent,
    ThemeConfigComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CKEditorModule,
    FormsModule,
    AlertModule.forRoot(),
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatButtonModule,
    FlexLayoutModule,
    PerfectScrollbarModule,
    ColorPickerModule
  ],
  providers: [AuthService, HttpService,ValidationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
