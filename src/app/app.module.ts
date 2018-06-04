import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AlertModule } from 'ngx-alerts';
import { LocationStrategy, HashLocationStrategy, CommonModule } from '@angular/common';
// import { Chart } from 'chart.js';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent, LogoutPopUpDialog } from './app.component';
import { LoginComponent, } from './login/login.component';
import { CallbackComponent } from './callback.component';
import { GalleryImagesService } from './service/gallery-images.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MediaLocalImagePopupDialog } from './pages/pages.component'; // PagesComponent
import { HttpService } from './service/httpClient.service';
import { AdminDashboardComponent } from './admin/admin-dashboard.component';
import { ProfileComponent } from './profile/profile.component';
// import { LogoComponent } from './logo/logo.component';
import { AdminComponent, EmptyAccessLevelDialog } from './admin/admin.component';
import { CKEditorModule } from 'ngx-ckeditor';
import { ValidationService } from './service/validation.service';
// import { SocialLinksComponent } from './sociallinks/sociallinks.component';
// import { SMTPConfigurationComponent } from './smtpconfiguration/smtpconfiguration.component';
import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';
import { EmailTemplateSelectionPopup } from './emailservice/emailservice.component'; // EmailserviceComponent
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { NgxSmartLoaderModule, NgxSmartLoaderService } from 'ngx-smart-loader';
import {
  MatButtonModule, MatFormFieldModule, MatInputModule,
  MatDialogModule, MatSlideToggleModule, MatProgressBarModule,
  MatDatepickerModule, MatPaginatorModule, MatTableModule, MatSortModule,
  MatNativeDateModule, MatExpansionModule, DateAdapter,
  MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatSelectModule, MatMenuModule, MatTabsModule,
  MatCardModule, MatTooltipModule, MatCheckboxModule, MatListModule, MatAutocompleteModule, MatSnackBarModule
} from '@angular/material';
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
import { DialogOverviewExampleDialog, FileSelectPopup } from './media/media.component'; // FileSelectPopup // MediaComponent
import { SmsTemplateSelectionDialog } from './smsui/smsui.component'; // SmsuiComponent
import { MessageArchivedComponent } from '../app/directives/snackbar-sms-email/snackbar-email-sms';
import { AccessLevelPopup } from './create-user-component/create-user-component.component'; // CreateUserComponentComponent
// import { ThemeConfigComponent } from './theme-config/theme-config.component';
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
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { ViewGalleryComponent } from './view-gallery/view-gallery.component';
import { Router, RouterModule } from '@angular/router';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';

import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { SocialManagementComponent } from './social-management/social-management.component';

import { FacebookModule } from 'ngx-facebook';
import { FBService } from './service/fb.service';
import { NgxTwitterTimelineModule } from 'ngx-twitter-timeline';
// import { BiographyComponent } from './biography/biography.component';
import { DateFormat } from './model/date.formatt';
import { FeedbackComponent } from './feedback/feedback.component';
import { ChangemakerComponent } from './changemaker/changemaker.component';
import { FileRepositoryPopup, FileViewerPopUp } from './filerepository/filerepository.component'; // FilerepositoryComponent
// import { ManageReportsComponent } from './manage-reports/manage-reports.component';
import { MatIconModule } from '@angular/material/icon';
import { AnalyticsComponent } from './analytics/analytics.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
// import { DocumentViewModule } from 'ngx-document-view';
import { NgxPaginationModule } from 'ngx-pagination';
// import { CreateModuleComponent } from './create-module/create-module.component';
import { HeaderurlsComponent } from './headerurls/headerurls.component';
import { ProblemCategoryEditPopup } from './problem-category/problem-category.component'; // ProblemCategoryComponent
import { ProblemTypeService } from './service/problem-type.service';
import { AreaService } from './service/area.service';
import { AreasComponent, AreaEditPopup } from './areas/areas.component';
// import { TncComponent } from './tnc/tnc.component';
// import { PnpComponent } from './pnp/pnp.component';
import { DeletefolderDialog } from './filerepository/deletefolder.dialog';
import { DatabaseComponent } from './database/database.component';
import { ChartsGenderDirective } from './directives/charts-gender/charts-gender.directive';
import { ChartsAssignDirective } from './directives/charts-assign/charts-assign.directive';
import { ChartsStatusDirective } from './directives/charts-status/charts-status.directive';
import { ChartsLoyalityDirective } from './directives/charts-loyality/charts-loyality.directive';
import { ChartsProblemCategoryDirective } from './directives//charts-problem-category/charts-problem-category.directive';
import { AccessdeniedComponent } from './accessdenied/accessdenied.component';
// import { SmstemplateComponent } from './smstemplate/smstemplate.component';
import { EmailTemplateComponent, SafeHtmlPipe } from './email-template/email-template.component';
// import { ChooseplatformComponent } from './chooseplatform/chooseplatform.component';
import { EmailTemplateResolver } from './email-template/email-template.resolver';
import { EmailTemplateService } from './email-template/email-template-service';
import { AccessDataModelComponent } from './model/useraccess.data.model';
// import { SocialconfigurationComponent } from './socialconfiguration/socialconfiguration.component';
import { WhatsAppTemplatePopup } from './whatsapp/whatsapp.component'; // WhatsappComponent
import { SmsTemplateSelectService } from './smsui/sms-template-select-service';
import { ChartAgeDirective } from './directives/chart-age/chart-age.directive';
import { EditorSelectionService } from './service/editor-selection.service';
import { PapaParseModule } from 'ngx-papaparse';
import { ManageReportsResolver } from './manage-reports/manage-reports-resolver';
import { ManageReportService } from './manage-reports/manage-reports-service';
import { FeedbackService } from './feedback/feedback-service';
import { FeedbackResolver } from './feedback/feedback-resolver';
import { DataBaseResolver } from './database/database-resolver';
import { DataBaseService } from './database/database-service';
import { TwitterComponent } from './twitter/twitter.component';
import { TwitterServiceService } from './service/twitter-service.service';
import { MessageCompose } from './dialogs/social-compose/social-compose-message';
import { TwitterTimelineDirective } from './directives/twitter/twitter-timeline/twitter-timeline.directive';
import { WindowRef } from './admin/window.service';
import { SocialLoginComponent } from './social-login/social-login.component';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { TwitterUserService } from './service/twitter-user.service';
import { LinkyModule } from 'angular-linky';
import { AngularDateTimePickerModule } from 'angular2-datetimepicker';
import { FacebookComponentCommunicationService } from './service/social-comp-int.service';
import { MyDatePipe } from './_pipes/date-pipe';
import { ImagePreviewDialogComponent } from './dialogs/image-preview-dialog/image-preview-dialog.component';
import { EditFacebookMessage } from './dialogs/edit-fb-post/edit-fb-post-dialog';
import { AddSocialStreemDialog } from './dialogs/social-addstreem/social-addstreem.dialog';
export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig(), http, options);
}
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CallbackComponent,
    // LogoComponent,
    ProfileComponent,
    AdminDashboardComponent,
    AdminComponent,
    // PagesComponent,
    // SocialLinksComponent,
    ControlMessagesComponent,
    // SMTPConfigurationComponent,
    // EmailserviceComponent,
    ChatBoxComponent,
    // MediaComponent,
    // SmsuiComponent,
    // CreateUserComponentComponent,
    // ThemeConfigComponent,
    ViewGalleryComponent,
    SocialManagementComponent,
    // FilerepositoryComponent,
    // ManageReportsComponent,
    // directives
    EditGalleryItems,
    GalleryDirective,
    DialogOverviewExampleDialog,
    LogoutPopUpDialog,
    // ChangepasswordComponent,
    // BiographyComponent,
    FileSelectPopup,
    AccessLevelPopup,
    FileRepositoryPopup,
    FileViewerPopUp,
    FeedbackComponent,
    ChangemakerComponent,
    AnalyticsComponent,
    // CreateModuleComponent,
    DeletefolderDialog,
    // TncComponent,
    // PnpComponent,
    HeaderurlsComponent,
    // ProblemCategoryComponent,
    AreasComponent,
    DatabaseComponent,
    ChartsGenderDirective,
    ChartsAssignDirective,
    ChartsStatusDirective,
    ChartsLoyalityDirective,
    ChartsProblemCategoryDirective,
    EmptyAccessLevelDialog,
    AccessdeniedComponent,
    MediaLocalImagePopupDialog,
    // SmstemplateComponent,
    EmailTemplateComponent,
    // ChooseplatformComponent,
    // SocialconfigurationComponent,
    // WhatsappComponent,
    AccessDataModelComponent,
    // WhatsappComponent,
    // SocialconfigurationComponent,
    WhatsAppTemplatePopup,
    EmailTemplateSelectionPopup,
    ChartAgeDirective,
    SmsTemplateSelectionDialog,
    MessageArchivedComponent,
    SafeHtmlPipe,
    AreaEditPopup,
    ProblemCategoryEditPopup,
    TwitterComponent,
    TwitterTimelineDirective,
    MessageCompose,
    FacebookComponent,
    SocialLoginComponent,
    MyDatePipe,
    ImagePreviewDialogComponent,
    EditFacebookMessage,
    AddSocialStreemDialog,
    // FlujodatepickerDirective
    MessageCompose,
    FacebookComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forRoot([], { useHash: true }),
    BrowserModule,
    BrowserAnimationsModule,
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
    MatCheckboxModule,
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
    MatListModule,
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
    NgxPaginationModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatSnackBarModule,
    PapaParseModule,
    ScrollDispatchModule,
    // A2Edatetimepicker,
    AngularDateTimePickerModule,
    LinkyModule,
  ],
  entryComponents: [EditGalleryItems, DialogOverviewExampleDialog, LogoutPopUpDialog, FileSelectPopup, FileRepositoryPopup, FileViewerPopUp,
    AccessLevelPopup, DeletefolderDialog, EmptyAccessLevelDialog, MediaLocalImagePopupDialog, WhatsAppTemplatePopup,
    EmailTemplateSelectionPopup, SmsTemplateSelectionDialog, MessageArchivedComponent, AreaEditPopup, ProblemCategoryEditPopup,
    MessageCompose, ImagePreviewDialogComponent, EditFacebookMessage, AddSocialStreemDialog],
  providers: [
    // AuthService,
    HttpService,
    ValidationService,
    NgxSmartLoaderService,
    LoginAuthService,
    GalleryImagesService,
    FBService,
    ProblemTypeService,
    AreaService,
    { provide: DateAdapter, useClass: DateFormat },
    SmsTemplateSelectService,
    SmsTemplateSelectService,
    WindowRef,

    // AuthService,
    HttpService,
    ValidationService,
    NgxSmartLoaderService,
    LoginAuthService,
    GalleryImagesService,
    FBService,
    ProblemTypeService,
    AreaService,
    { provide: DateAdapter, useClass: DateFormat },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    SmsTemplateSelectService,
    EmailTemplateResolver,
    EmailTemplateService,
    EditorSelectionService,
    ManageReportsResolver,
    ManageReportService,
    FeedbackResolver,
    FeedbackService,
    DataBaseResolver,
    DataBaseService,
    AuthInterceptorService,
    TwitterServiceService,
    TwitterUserService,
    FacebookComponentCommunicationService,
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },

    { provide: DateAdapter, useClass: DateFormat }

  ],
  // exports: [
  //   FlujodatepickerDirective,
  // ],
  bootstrap: [AppComponent]
})
export class AppModule { }
