import { Component, OnInit, Inject } from '@angular/core';
import { FacebookService, InitParams, LoginResponse, LoginOptions } from 'ngx-facebook';
import { FBService } from '../service/fb.service';
import { IFBFeedResponse, IFBFeedArray, IPaginigCursors } from '../model/fb-feed.model';
import * as _ from 'underscore';
import { Router } from '@angular/router';
import { AdminComponent } from '../admin/admin.component';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material';
import { ThemePalette, MatDatepickerInputEvent } from '@angular/material';
import * as moment from 'moment';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';

@Component({
  selector: 'app-root',
  templateUrl: './social-management.component.html',
  styleUrls: ['./social-management.component.scss']
})
export class SocialManagementComponent implements OnInit {
  doSchedule: true;
  test: FormGroup;
  test1: string;
  test2: string;
  test3: string;
  test4: string;
  filteredUserAccessData: any;
  userAccessLevelObject: any;
  postis = 4;
  fbNextPage: IPaginigCursors;
  fbResponseData: IFBFeedArray;
  fbResponseDataItems: Array<IFBFeedArray>;
  // tslint:disable-next-line:max-line-length
  getFBFeerUrl: string;
  isFbLogedin = false;
  isShowTwitter = false;
  access_token: any;
  config: any;

  constructor(public dialog: MatDialog, private fb: FacebookService, private formBuilder: FormBuilder,
    public mScrollbarService: MalihuScrollbarService,

    private fbService: FBService, private router: Router,
    private spinnerService: Ng4LoadingSpinnerService, public adminComponent: AdminComponent) {
    this.fbResponseData = <IFBFeedArray>{};
    this.fbResponseDataItems = [];
    fbService.FBInit();

    this.test = this.formBuilder.group({
      'test1': ['', Validators.required],
      'test2': ['', Validators.required],
      'test3': ['', Validators.required],
      'test4': ['', Validators.required],
    });
  }
  ngOnInit(): void {
    setTimeout(function () {
      this.test.controls['test1'].setValue('test1');
      this.test.controls['test2'].setValue('test2');
      this.test.controls['test3'].setValue('test3');
      this.test.controls['test4'].setValue('test4');
    }.bind(this), 3000);
    // tslint:disable-next-line:max-line-length
    // this.fb.api('https://graph.facebook.com/v2.12/Squaretechnos1/feed/?fields=created_time,message,comments.summary(true),likes.summary(true),full_picture&limit=25&access_token=' + localStorage.getItem('access_token'), 'get')
    //   .then((res: IFBFeedResponse) => {
    //     this.fbResponseData = res.data;
    //     this.fbNextPage = res.paging.next;
    //     console.log(this.fbResponseData);
    //     console.log(res);
    //   })
    //   .catch((e: any) => {
    //     console.log(e);
    //   });

    // this.mScrollbarService.initScrollbar('.posts-scrollable', { axis: 'y', theme: 'minimal' });

  }

  openmessageComposeDialog(): void {
    const dialogRef = this.dialog.open(MessageCompose, {
      panelClass: 'app-full-bleed-dialog',
      width: '45vw',
      height: '61vh',
      data: '',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  fbLogin = () => {
    // login with options
    const options: LoginOptions = {
      scope: 'public_profile,user_friends,email, pages_show_list , manage_pages, publish_pages',
      return_scopes: true,
      enable_profile_selector: true
    };
    this.fb.login(options)
      .then((response: LoginResponse) => {
        console.log(response);
        localStorage.setItem('access_token', response.authResponse.accessToken);
        // this.access_token = response.authResponse.accessToken;
        // tslint:disable-next-line:max-line-length
        // this.getFBFeerUrl = 'https://graph.facebook.com/v2.12/dasyam.vinayabhaskar/feed/?fields=created_time,message,comments.summary(true),likes.summary(true),full_picture&limit=25&access_token=' + localStorage.getItem('access_token');
        // this.isFbLogedin = true;
        // this.getFBFeedFromApi(this.getFBFeerUrl);
      }
      )
      .catch((e: Error) => {
        console.log(e);
      });
  }
  /* make the API call */
  getDebugToken = () => {
     // tslint:disable-next-line:max-line-length
     this.fb.api('https://graph.facebook.com/v2.12/oauth/access_token?grant_type=fb_exchange_token&client_id=149056292450936&client_secret=d9a268c797f16d10ce58c44e923488aa&fb_exchange_token=EAACHkN9c8ngBABoqnD32p6ozaGBFdDZBYN0msdi052zd0c4IcpB7IBZAAE5S3W9hBXgyItsGZBakGQ0Xoe8KyLgwGMWm2OisdQXxr6fO7s8vMpZCatz6bK8zX5Rv0QIdcKrEU0cCzbNAGHXFr6ZBBKS87eJow1kYZD', 'get').then((resp) => {
      console.log(resp);
    })
    .catch((err) => {
      console.log(err);
    });
    // this is used for debug token
    // tslint:disable-next-line:max-line-length
    // this.fb.api('https://graph.facebook.com/v2.12/debug_token?input_token=' + localStorage.getItem('access_token'), 'get').then((resp) => {
    //   console.log(resp);
    // })
    // .catch((err) => {
    //   console.log(err);
    // });
  }
  // getting facebook feed graph api calling
  getFBFeedFromApi(graphurl) {
    if (graphurl) {
      this.fb.api(graphurl, 'get')
        .then((res: IFBFeedResponse) => {
          console.log(res.data);
          _.each(res.data, (fbData: IFBFeedArray) => {
            this.fbResponseData = fbData;
            this.fbResponseDataItems.push(this.fbResponseData);
          });
          // this.fbResponseDataItems.push(res.data);
          // this.fbResponseData.push(res.data);

          // this.fbResponseData = res.data;
          if (res.paging.next) {
            this.fbNextPage = res.paging.next;
          } else {
            this.fbNextPage = null;
          }
        })
        .catch((e: any) => {
          console.log(e);
        });
    }
  }

  fbLoadMore = () => {
    this.getFBFeedFromApi(this.fbNextPage);
  }

  getTwitterFeed() {
    this.isShowTwitter = true;
  }

  // getPageToken = () => {
  //   this.fb.api('https://graph.facebook.com/v2.12/Squaretechnos1?fields=access_token')
  //     .then((rep: any) => {
  //       console.log(rep);
  //       localStorage.setItem('page_token', rep.access_token);
  //     })
  //     .catch((ee) => {
  //       console.log(ee);
  //     });

  // }

  addPost() {

    // this.fb.api('https://graph.facebook.com/v2.12/Squaretechnos1/feed?is_published=true',
    // tslint:disable-next-line:max-line-length
    this.fb.api('https://graph.facebook.com/v2.12/Squaretechnos1/feed',
      'post',
      {
        'message': 'This is a test message' + this.postis
      })
      .then((respo: any) => {
        this.postis = this.postis + 1;
        console.log(respo);
      })
      .catch((err: Error) => {
        console.log(err);
      });
  }

  // publishPost = () => {


  //   // tslint:disable-next-line:max-line-length
  //   console.log(localStorage.getItem('page_token'));
  // tslint:disable-next-line:max-line-length
  // this.fb.api('https://graph.facebook.com/964338043669329_1212304148872716?is_published=true&access_token=' + localStorage.getItem('page_token'),
  //     'post')
  //     .then((respo: Response) => {
  //       console.log(respo);
  //     })
  //     .catch((err: Error) => {
  //       console.log(err);
  //     });

  // }
  // logout() {
  //   this.fb.logout();
  // }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'message-compose',
  templateUrl: 'message-compose.html',
  styleUrls: ['./social-management.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class MessageCompose {

  constructor(
    public dialogRef: MatDialogRef<MessageCompose>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }


}
