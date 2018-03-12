import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AlertModule } from 'ngx-alerts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent, LogoutPopUpDialog } from './app.component';
import { LoginComponent, } from './login/login.component';
import { CallbackComponent } from './callback.component';
// import { AuthService } from './auth/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagesComponent } from './pages/pages.component';
import { HttpService } from './service/httpClient.service';
import { AdminDashboardComponent } from './admin/admin-dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { LogoComponent } from './logo/logo.component';
import { AdminComponent } from './admin/admin.component';
import { CKEditorModule } from 'ngx-ckeditor';
import { ValidationService } from './service/validation.service';
import { SocialLinksComponent } from './sociallinks/sociallinks.component';
import { SMTPConfigurationComponent } from './smtpconfiguration/smtpconfiguration.component';
// import { ReportsComponent } from './reports/reports.component';
import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';
import { EmailserviceComponent } from './emailservice/emailservice.component';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { NgxSmartLoaderModule, NgxSmartLoaderService } from 'ngx-smart-loader';
import { MatButtonModule, MatFormFieldModule, MatInputModule,
  // tslint:disable-next-line:max-line-length
  MatDialogModule,MatSlideToggleModule, MatDatepickerModule, MatNativeDateModule,MatExpansionModule, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE,  MatSelectModule, MatMenuModule, MatTabsModule, MatCardModule, MatTooltipModule, MatAutocompleteModule } from '@angular/material';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
// this includes the core NgIdleModule but includes keepalive providers for easy wireup
import { MomentModule } from 'angular2-moment'; // optional, provides moment-style pipes for date formatting
import { ControlMessagesComponent } from './directives/control-messages.component';
import { GalleryDirective } from './directives/gallery/gallery.directive';
import { EditGalleryItems } from './directives/edit-gallery-popup/editgallery.popup';
// Angular Flex Layout
import { FlexLayoutModule } from '@angular/flex-layout';
import { ImageUploadModule } from 'angular2-image-upload';
// Perfect Scroll Bar
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { MediaComponent, DialogOverviewExampleDialog, FileSelectPopup } from './media/media.component';
import { SmsuiComponent } from './smsui/smsui.component';
import { CreateUserComponentComponent, AccessLevelPopup } from './create-user-component/create-user-component.component';
import { ThemeConfigComponent } from './theme-config/theme-config.component';
import { ColorPickerModule } from 'ngx-color-picker';
const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { Http, RequestOptions } from '@angular/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './auth/token.interceptor';
import { AuthInterceptorService } from './auth/auth.interceptorservice';
import { LoginAuthService } from './auth/login.auth.service';
import { EditorComponent } from './editor/editor.component';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { ViewGalleryComponent} from './view-gallery/view-gallery.component';
import { Router } from '@angular/router';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { SocialManagementComponent } from './social-management/social-management.component';
import { FacebookModule } from 'ngx-facebook';
import { FBService } from './service/fb.service';
import { NgxTwitterTimelineModule } from 'ngx-twitter-timeline';
import { BiographyComponent } from './biography/biography.component';
import { DateFormat } from './model/date.formatt';
import { ReportanissueComponent } from './reportanissue/reportanissue.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { ChangemakerComponent } from './changemaker/changemaker.component';
import { FilerepositoryComponent, FileRepositoryPopup } from './filerepository/filerepository.component';
import { ManageReportsComponent } from './manage-reports/manage-reports.component';
import {MatIconModule} from '@angular/material/icon';
import { AnalyticsComponent } from './analytics/analytics.component';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig(), http, options);
}
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
    // ReportsComponent,
    EmailserviceComponent,
    ChatBoxComponent,
    MediaComponent,
    SmsuiComponent,
    CreateUserComponentComponent,
    ThemeConfigComponent,
    EditorComponent,
    ViewGalleryComponent,
    SocialManagementComponent,
    FilerepositoryComponent,
    ManageReportsComponent,
    // directives
    EditGalleryItems,
    GalleryDirective,
    DialogOverviewExampleDialog,
    LogoutPopUpDialog,
    ChangepasswordComponent,
    BiographyComponent,
    FileSelectPopup,
    AccessLevelPopup,
    FileRepositoryPopup,
    ReportanissueComponent,
    FeedbackComponent,
    ChangemakerComponent,
    AnalyticsComponent
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
    ColorPickerModule,
    ImageUploadModule.forRoot(),
    ColorPickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatMenuModule,
    ColorPickerModule,
    LoadingModule,
    Ng4LoadingSpinnerModule.forRoot(),
    NgxSmartLoaderModule.forRoot(),
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    MatDialogModule,
    MatTabsModule,
    MatTooltipModule,
    MatExpansionModule,
    MatCardModule,
    MatIconModule,
    MomentModule,
    MatAutocompleteModule,
    NgIdleKeepaliveModule.forRoot(),
    MalihuScrollbarModule.forRoot(),
    FacebookModule.forRoot(),
    NgxTwitterTimelineModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule
  ],

  entryComponents: [EditGalleryItems, DialogOverviewExampleDialog, LogoutPopUpDialog, FileSelectPopup, FileRepositoryPopup, AccessLevelPopup],
  providers: [
              // AuthService,
              HttpService,
              ValidationService,
              NgxSmartLoaderService,
              LoginAuthService,
              FBService,
              {provide: DateAdapter, useClass: DateFormat}
              // AuthInterceptorService,
              // {
              // provide: AuthHttp,
              // useFactory: authHttpServiceFactory,
              // deps: [Http, RequestOptions]
              // },
              // {
              //   provide: HTTP_INTERCEPTORS,
              //   useClass: TokenInterceptor,
              //   multi: true
              // }
            ],
  bootstrap: [AppComponent]
})
export class AppModule { }
