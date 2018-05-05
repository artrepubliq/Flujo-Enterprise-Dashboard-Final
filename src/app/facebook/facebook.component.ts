import { Component, OnInit, Input } from '@angular/core';
import { FBService } from '../service/fb.service';
import { FacebookService, InitParams, LoginResponse, LoginOptions } from 'ngx-facebook';
import { IFBFeedResponse, IFBFeedArray, IPaginigCursors } from '../model/fb-feed.model';
import * as _ from 'underscore';
@Component({
  selector: 'app-facebook',
  templateUrl: './facebook.component.html',
  styleUrls: ['./facebook.component.scss', '../social-management/social-management.component.scss']
})
export class FacebookComponent implements OnInit {
  fbNextPage: IPaginigCursors;
  fbResponseData: IFBFeedArray;
  fbResponseDataItems: Array<IFBFeedArray>;
  postis = 4;
  isFbLogedin = false;
  @Input() FbLongLivedToken: string;
  constructor(private fbService: FBService, private fb: FacebookService) { }

  ngOnInit() {
    console.log(this.FbLongLivedToken);
    if (this.FbLongLivedToken.length > 0) {
    // tslint:disable-next-line:max-line-length
    this.fb.api('https://graph.facebook.com/v3.0/me/feed/?fields=created_time,message,comments.summary(true),likes.summary(true),full_picture&limit=25&access_token=' + this.FbLongLivedToken, 'get')
      .then((res: IFBFeedResponse) => {

        this.fbNextPage = res.paging.next;
        console.log(this.fbResponseData);
        console.log(res);
      })
      .catch((e: any) => {
        console.log(e);
      });
    }
  }
}

