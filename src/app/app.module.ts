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
import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';
import { EmailserviceComponent } from './emailservice/emailservice.component';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { NgxSmartLoaderModule, NgxSmartLoaderService } from 'ngx-smart-loader';
import { MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatMenuModule, MatTabsModule, MatTooltipModule } from '@angular/material';
//directives
import { ControlMessagesComponent } from './directives/control-messages.component';
import { GalleryDirective } from './directives/gallery/gallery.directive';
// Angular Flex Layout
import { FlexLayoutModule } from '@angular/flex-layout';
import { ImageUploadModule } from "angular2-image-upload";
// Perfect Scroll Bar
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { MediaComponent } from  './media/media.component';
import { SmsuiComponent } from './smsui/smsui.component';
import { CreateUserComponentComponent } from './create-user-component/create-user-component.component';
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
import { EditorComponent } from './editor/editor.component';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { ViewGalleryComponent, EditGalleryItems } from './view-gallery/view-gallery.component';
import {MatDialogModule} from '@angular/material/dialog';
import { Router } from '@angular/router';
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
    ReportsComponent,
    EmailserviceComponent,
    ChatBoxComponent,
    MediaComponent,
    SmsuiComponent,
    CreateUserComponentComponent,
    ThemeConfigComponent,
    EditorComponent,
    ViewGalleryComponent,
    EditGalleryItems,

    //directives
    GalleryDirective
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
    MatTooltipModule
  ],
  entryComponents: [EditGalleryItems],
  providers: [AuthService,
              HttpService,
              ValidationService,
              NgxSmartLoaderService,
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