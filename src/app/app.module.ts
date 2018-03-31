import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AlertModule } from 'ngx-alerts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent, LogoutPopUpDialog } from './app.component';
import { LoginComponent, } from './login/login.component';
import { CallbackComponent } from './callback.component';
import { GalleryImagesService } from './service/gallery-images.service';
import { RoleGuardService } from './auth/role-guard.service';
import { UseraccessServiceService } from './service/useraccess-service.service';
// import { AuthService } from './auth/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagesComponent } from './pages/pages.component'; // MediaLocalImagePopupDialog
import { HttpService } from './service/httpClient.service';
import { AdminDashboardComponent } from './admin/admin-dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { LogoComponent } from './logo/logo.component';
import { AdminComponent, EmptyAccessLevelDialog } from './admin/admin.component';
import { CKEditorModule } from 'ngx-ckeditor';
import { ValidationService } from './service/validation.service';
import { SocialLinksComponent } from './sociallinks/sociallinks.component';
import { SMTPConfigurationComponent } from './smtpconfiguration/smtpconfiguration.component';
import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';
import { EmailserviceComponent } from './emailservice/emailservice.component';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { NgxSmartLoaderModule, NgxSmartLoaderService } from 'ngx-smart-loader';
import { MatButtonModule, MatFormFieldModule, MatInputModule,
    MatDialogModule, MatSlideToggleModule, MatProgressBarModule,
    MatDatepickerModule, MatPaginatorModule, MatTableModule, MatSortModule,
    MatNativeDateModule, MatExpansionModule, DateAdapter,
    MAT_DATE_FORMATS, MAT_DATE_LOCALE,  MatSelectModule, MatMenuModule, MatTabsModule,
    MatCardModule, MatTooltipModule, MatAutocompleteModule } from '@angular/material';
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
import { MediaComponent, DialogOverviewExampleDialog, FileSelectPopup } from './media/media.component'; // FileSelectPopup
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
import { FilerepositoryComponent, FileRepositoryPopup, FileViewerPopUp } from './filerepository/filerepository.component';
import { ManageReportsComponent } from './manage-reports/manage-reports.component';
import {MatIconModule} from '@angular/material/icon';
import { AnalyticsComponent } from './analytics/analytics.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DocumentViewModule } from 'ngx-document-view';
import { NgxPaginationModule } from 'ngx-pagination';
import { CreateModuleComponent } from './create-module/create-module.component';
import { HeaderurlsComponent } from './headerurls/headerurls.component';
import { ProblemCategoryComponent } from './problem-category/problem-category.component';
import { ProblemTypeService } from './service/problem-type.service';
import { AreaService } from './service/area.service';
import { AreasComponent } from './areas/areas.component';
import { TncComponent } from './tnc/tnc.component';
import { PnpComponent } from './pnp/pnp.component';
import { DeletefolderDialog } from './filerepository/deletefolder.dialog';
import { ChartsAgePieComponent } from './charts-age-pie/charts-age-pie.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartAgeDirective } from './chart-age.directive';
import { DatabaseComponent } from './database/database.component';
import { ChartsGenderComponent } from './charts-gender/charts-gender.component';
import { AccessdeniedComponent } from './accessdenied/accessdenied.component';

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
    FileViewerPopUp,
    ReportanissueComponent,
    FeedbackComponent,
    ChangemakerComponent,
    AnalyticsComponent,
    CreateModuleComponent,
    DeletefolderDialog,
    TncComponent,
    PnpComponent,
    HeaderurlsComponent,
    ProblemCategoryComponent,
    AreasComponent,
    ChartsAgePieComponent,
    ChartAgeDirective,
    DatabaseComponent,
    ChartsGenderComponent,
    EmptyAccessLevelDialog,
    AccessdeniedComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgxChartsModule,
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
    MatAutocompleteModule,
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
    MatProgressBarModule,
    MatAutocompleteModule,
    NgIdleKeepaliveModule.forRoot(),
    MalihuScrollbarModule.forRoot(),
    FacebookModule.forRoot(),
    NgxTwitterTimelineModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    PdfViewerModule,
    DocumentViewModule,
    NgxPaginationModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    NgxChartsModule
  ],
  entryComponents: [EditGalleryItems, DialogOverviewExampleDialog, LogoutPopUpDialog, FileSelectPopup, FileRepositoryPopup, FileViewerPopUp,
     AccessLevelPopup, DeletefolderDialog, EmptyAccessLevelDialog], // MediaLocalImagePopupDialog
  providers: [
              // AuthService,
              HttpService,
              ValidationService,
              NgxSmartLoaderService,
              LoginAuthService,
              GalleryImagesService,
              FBService,
              ProblemTypeService,
              RoleGuardService,
              UseraccessServiceService,
              AreaService,
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
