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
import { MediaLocalImagePopupDialog, PagesComponent } from './pages/pages.component'; // PagesComponent
import { HttpService } from './service/httpClient.service';
import { AdminDashboardComponent } from './admin/admin-dashboard.component';
import { ProfileComponent } from './profile/profile.component';
// import { LogoComponent } from './logo/logo.component';
import { AdminComponent } from './admin/admin.component';
import { CKEditorModule } from 'ngx-ckeditor';
import { ValidationService } from './service/validation.service';
// import { SocialLinksComponent } from './sociallinks/sociallinks.component';
// import { SMTPConfigurationComponent } from './smtpconfiguration/smtpconfiguration.component';
import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';
import { EmailTemplateSelectionPopup } from './emailservice/emailservice.component'; // EmailserviceComponent
import { EmailTemplateSelectionModal } from './directives/email-config/send-emails/send-emails.component'; // EmailserviceComponent
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { NgxSmartLoaderModule, NgxSmartLoaderService } from 'ngx-smart-loader';
import {
  MatButtonModule, MatFormFieldModule, MatInputModule,
  MatDialogModule, MatSlideToggleModule, MatProgressBarModule,
  MatDatepickerModule, MatPaginatorModule, MatTableModule, MatSortModule,
  MatNativeDateModule, MatExpansionModule, DateAdapter,
  MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatMenuModule, MatTabsModule,
  MatCardModule, MatTooltipModule, MatCheckboxModule, MatListModule,
  MatAutocompleteModule, MatSnackBarModule, MatProgressSpinnerModule
} from '@angular/material';

import { MatSelectModule } from '@angular/material/select';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { ControlMessagesComponent } from './directives/control-messages.component';
import { GalleryDirective } from './directives/gallery/gallery.directive';
import { EditGalleryItems } from './directives/edit-gallery-popup/editgallery.popup';
// Angular Flex Layout
import { FlexLayoutModule } from '@angular/flex-layout';
// Perfect Scroll Bar
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { SmsTemplateSelectionDialog } from './smsui/smsui.component'; // SmsuiComponent
import { MessageArchivedComponent } from '../app/directives/snackbar-sms-email/snackbar-email-sms';
// import { ThemeConfigComponent } from './theme-config/theme-config.component';
import { ColorPickerModule } from 'ngx-color-picker';
const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { Http, RequestOptions, HttpModule } from '@angular/http';
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
// import { ManageReportsComponent } from './manage-reports/manage-reports.component';
import { MatIconModule } from '@angular/material/icon';
import { AnalyticsComponent } from './analytics/analytics.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
// import { DocumentViewModule } from 'ngx-document-view';
import { NgxPaginationModule } from 'ngx-pagination';
import { CreateModuleComponent } from './create-module/create-module.component';
import { HeaderurlsComponent } from './headerurls/headerurls.component';
import { ProblemCategoryEditPopup } from './problem-category/problem-category.component'; // ProblemCategoryComponent
import { ProblemTypeService } from './service/problem-type.service';
import { AreaService } from './service/area.service';
import { AreasComponent, AreaEditPopup } from './areas/areas.component';
import { TncComponent } from './tnc/tnc.component';
import { PnpComponent } from './pnp/pnp.component';
import { DeletefolderDialog } from './filerepository/deletefolder.dialog';
import { DatabaseComponent } from './database/database.component';
import { ChartsGenderDirective } from './directives/charts-gender/charts-gender.directive';
import { ChartsAssignDirective } from './directives/charts-assign/charts-assign.directive';
import { ChartsStatusDirective } from './directives/charts-status/charts-status.directive';
import { ChartsLoyalityDirective } from './directives/charts-loyality/charts-loyality.directive';
import { ChartsProblemCategoryDirective } from './directives//charts-problem-category/charts-problem-category.directive';
import { AccessdeniedComponent } from './accessdenied/accessdenied.component';
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
import { FacebookComponentCommunicationService } from './service/social-comp-int.service';
import { MyDatePipe } from './_pipes/date-pipe';
import { ImagePreviewDialogComponent } from './dialogs/image-preview-dialog/image-preview-dialog.component';
import { EditFacebookMessage } from './dialogs/edit-fb-post/edit-fb-post-dialog';
import { AddSocialStreemDialog } from './dialogs/social-addstreem/social-addstreem.dialog';
import { FacebookComponent } from './facebook/facebook.component';
import { TwitterLinkyPipe } from './_pipes/twitter-linky.pipe';
import { ProfileInfoDialog } from './dialogs/profile-info/profile-info.dialog';
import { PostCommentTwitterCompose } from './dialogs/post-comment/post-comment-twitter.dialog';
import { FacebookLinkyPipe } from './_pipes/facebook-linky.pipe';
import { PostCommentCompose } from './dialogs/post-comment/post-comment.dialog';
import { EmailConfigComponent } from './email-config/email-config.component';
import { EmailConfigService } from './service/email-config.service';
import { CreateDomainEmailComponent } from './directives/email-config/create-domain-email/create-domain-email.component';
import { DomainDetailsComponent } from './directives/email-config/domain-details/domain-details.component';
import { SmtpDetailsComponent } from './directives/email-config/smtp-details/smtp-details.component';
import { MailingListComponent } from './directives/email-config/mailing-list/mailing-list.component';
import { AddUserListComponent } from './directives/email-config/create-mail-list/add-user-list.component';
import { SendEmailsComponent } from './directives/email-config/send-emails/send-emails.component';
import { AddDomainsComponent } from './domain/add-domains/add-domains.component';
import { CertificatesComponent } from './domain/certificates/certificates.component';
import { CreateDomainComponent } from './domain/create-domain/create-domain.component';
import { DomainDeploymentsComponent } from './domain/domain-deployments/domain-deployments.component';
import { DomainManagementComponent } from './domain/domain-management/domain-management.component';
import { ListOfDomainsComponent } from './domain/list-of-domains/list-of-domains.component';
import { DomainsService } from './domain/services/domains.service';
import { GloblalSmsService } from './service/global-sms.service';
import { FileSelectPopup } from './dialogs/media-file-select.popup/media-file-select.popup';
import { MediaDeletePopup } from './dialogs/media-delete-popup/media-delete.popup';
import { FileRepositoryPopup } from './filerepository/filerepository.popup.component';
import { FileViewerPopUp } from './filerepository/FileViewer.PopUp.component';
import { AngularDateTimePickerModule } from 'angular2-datetimepicker';
import { ClientUserAccessDenied } from './dialogs/client-useraccess-denied/client-useraccess-denied.popup';
import { AccessLevelPopup } from './dialogs/create-useraccesslevels-popup/create-useraccesslevels-popup';
import { UserAccesslevelsService } from './service/user-accesslevels.service';
import { WebBuilderComponent } from './web-builder/web-builder.component';
import { EmailBuilderComponent } from './email-builder/email-builder.component';
import { MailSetupComponent } from './mail-setup/mail-setup.component';
import { DefaultEmailTemplatesComponent } from './default-email-templates/default-email-templates.component';
import { EmailTemplatePreviewDialog } from './dialogs/email-template-dialogs/email-template-preview.dialog';
import { EmailTemplateComponent } from './email-template/email-template.component';
import { EmailTemplateResolver } from './email-template/email-template.resolver';
import { EmailTemplateService } from './email-template/email-template-service';
import { SafeHtmlPipe } from './_pipes/safe-html-email.pipe';
import { PagesContentEditor } from './directives/contentEditor/pages-content-editor';
import { SignupComponent } from './signup/signup.component';
import { PickerModule } from 'ngx-odinvt-emoji-mart';
import { SocketConnectionListenerService } from './service/socket-connection-listener.service';
import { SocketService } from './service/socketservice.service';
import { ChatHttpApiService } from './service/chat-http-api.service';
import { ChatDockUsersService } from './service/chat-dock-users.service';
import { UploaderService } from './service/uploader.service';
import { MessageService } from './service/message.services';
import { MessagesComponent } from './messages-progress/messages.component';
import { HttpErrorHandler } from './http-error-handler.services';
// import {TemplateDrivenFormComponent} from './template-driven-form.component'

import {FileValueAccessor} from './service/file-control-value-accessor'
import {FileValidator} from './service/file-input.validator'
export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig(), http, options);
}
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CallbackComponent,
    ProfileComponent,
    AdminDashboardComponent,
    AdminComponent,
    PagesComponent,
    PagesContentEditor,
    ControlMessagesComponent,
    ChatBoxComponent,
    ViewGalleryComponent,
    SocialManagementComponent,
    EditGalleryItems,
    GalleryDirective,
    LogoutPopUpDialog,
    FileSelectPopup,
    MediaDeletePopup,
    AccessLevelPopup,
    FileRepositoryPopup,
    FileViewerPopUp,
    FeedbackComponent,
    ChangemakerComponent,
    AnalyticsComponent,
    CreateModuleComponent,
    DeletefolderDialog,
    TncComponent,
    PnpComponent,
    HeaderurlsComponent,
    MessagesComponent,
    // ProblemCategoryComponent,
    AreasComponent,
    DatabaseComponent,
    ChartsGenderDirective,
    ChartsAssignDirective,
    ChartsStatusDirective,
    ChartsLoyalityDirective,
    ChartsProblemCategoryDirective,
    ClientUserAccessDenied,
    AccessdeniedComponent,
    MediaLocalImagePopupDialog,
    EmailTemplateComponent,
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
    TwitterLinkyPipe,
    ProfileInfoDialog,
    PostCommentTwitterCompose,
    FacebookLinkyPipe,
    ProfileInfoDialog,
    PostCommentCompose,
    EmailConfigComponent,
    CreateDomainEmailComponent,
    DomainDetailsComponent,
    SmtpDetailsComponent,
    MailingListComponent,
    AddUserListComponent,
    SendEmailsComponent,
    EmailTemplateSelectionModal,
    AddDomainsComponent,
    CertificatesComponent,
    CreateDomainComponent,
    DomainDeploymentsComponent,
    DomainManagementComponent,
    ListOfDomainsComponent,
    WebBuilderComponent,
    EmailBuilderComponent,
    MailSetupComponent,
    DefaultEmailTemplatesComponent,
    EmailTemplatePreviewDialog,
    SignupComponent,
    FileValueAccessor,
    FileValidator,
    MessagesComponent    
  ],
  imports: [
    CommonModule,
    RouterModule.forRoot([], { useHash: true }),
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    HttpModule,
    CKEditorModule,
    FormsModule,
    AlertModule.forRoot(),
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatButtonModule,
    FlexLayoutModule,
    PerfectScrollbarModule,
    ColorPickerModule,
    ColorPickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    AngularDateTimePickerModule,
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
    MatProgressSpinnerModule,
    PapaParseModule,
    ScrollDispatchModule,
    PickerModule
    ],
  entryComponents: [EditGalleryItems, MediaDeletePopup, LogoutPopUpDialog, FileSelectPopup, FileRepositoryPopup, FileViewerPopUp,
    AccessLevelPopup, DeletefolderDialog, ClientUserAccessDenied, MediaLocalImagePopupDialog, WhatsAppTemplatePopup,
    EmailTemplateSelectionPopup, SmsTemplateSelectionDialog, MessageArchivedComponent, AreaEditPopup, ProblemCategoryEditPopup,
    MessageCompose, ImagePreviewDialogComponent, EditFacebookMessage, AddSocialStreemDialog, ProfileInfoDialog,
    EmailTemplateSelectionModal, EmailTemplatePreviewDialog,
    PostCommentCompose, PostCommentTwitterCompose],
  providers: [
    ChatBoxComponent,
    UserAccesslevelsService,
    HttpService,
    ValidationService,
    NgxSmartLoaderService,
    LoginAuthService,
    GalleryImagesService,
    FBService,
    ProblemTypeService,
    SocketConnectionListenerService,
    ChatHttpApiService,
    SocketService,
    AreaService,
    { provide: DateAdapter, useClass: DateFormat },
    SmsTemplateSelectService,
    SmsTemplateSelectService,
    WindowRef,
    UploaderService,
    MessageService,
    HttpErrorHandler,
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
    EmailConfigService,
    DomainsService,
    GloblalSmsService,
    ChatDockUsersService,
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
