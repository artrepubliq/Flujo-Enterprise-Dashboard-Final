import { Component, OnInit, Input, OnDestroy, Output, HostListener } from '@angular/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { TwitterServiceService } from '../../../service/twitter-service.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { Observable } from 'rxjs/Observable';
// import { Subscription } from 'rxjs/Subscription';
import { TwitterUserService } from '../../../service/twitter-user.service';
import { EventEmitter } from 'events';
import {
  ITwitterTimelineObject, ITwitUser, ITwitterUserProfile, ITwitTimeLineObject, ITwitterMedia, ITwitterUser
} from '../../../model/twitter/twitter.model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { ImagePreviewDialogComponent } from '../../../dialogs/image-preview-dialog/image-preview-dialog.component';
import { ProfileInfoDialog } from '../../../dialogs/profile-info/profile-info.dialog';
import { AppConstants } from '../../../app.constants';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-twitter-timeline',
  templateUrl: './twitter-timeline.directive.html',
  styleUrls: ['./twitter-timeline.directive.scss']
})
// tslint:disable-next-line:component-class-suffix
export class TwitterTimelineDirective implements OnInit, OnDestroy {
  autolinker: string;
  public twitterUserObject: ITwitUser;
  public twitterUser: ITwitterUserProfile[];
  public config: any;
  dofix: boolean;

  private ngUnSubScribe = new Subject();
  public homeTimeLine = 'homeTimeLine';
  public userTimeLine = 'usertimeline';
  public mentions = 'mentions';
  public retweets = 'retweets';

  @Input() twitHomeTimeLine: ITwitterTimelineObject[];
  @Input() twitUserTimeLine: ITwitterTimelineObject[];
  @Input() twitMentionsTimeLine: ITwitterTimelineObject[];
  @Input() tweetsTimeLine: ITwitterTimelineObject[];
  @Input() header_title: string;
  // @Output() replyTweetObject = new Subject<ITwitterTimelineObject>();

  constructor(
    private twitterService: TwitterServiceService,
    private twitterUserService: TwitterUserService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
  ) {
  }

  ngOnInit() {
    this.twitterUserService.getTwitusers().takeUntil(this.ngUnSubScribe)
      .subscribe(
        result => {
          console.log(result);
        },
        error => {
          console.log(error);
        },
    );

    this.twitterUserObject = this.twitterUserService.getTwitterUserData;
    this.twitterUser = this.twitterUserObject.data;
    // console.log(this.twitTimeLine);
    // this.autolinker = Autolinker.link('www.hii.com #hahahahah im in anotation',
    // { twitter: true, className: 'hai', hashtag: true, urls: true });
    // console.log(autolinker);
  }

  /**
   * this is a function to delete tweet
   * @param tweetid this is the tweet id we need to delete
   */
  public deleteTweet(timeline: ITwitterTimelineObject): void {
    console.log(timeline);
    const params = { id: timeline.id_str };

    this.twitterService.deleteTweetOfId(params)
      .subscribe(
        result => {
          if (!result.data.errors) {
            console.log(result.data);
            this.snackBar.open('Tweet deleted', 'Dismiss');
          } else {
            if (result.data.errors[0].code === 144) {
              this.snackBar.open('Tweet not found on Twitter.com', 'Dismiss');
            }
            console.log(result.data.errors);
          }
        },
        error => {
          console.log(error);
        }
      );
  }

  /**
   * THis is for retweeting the tweet or status
   * @param timeline this is the timeline object(tweet or status object)
   */
  public retweet(timeline: ITwitterTimelineObject) {
    console.log(timeline);
    if (timeline.retweeted) {
      return;
    } else {
      const params = { id: timeline.id_str };
      this.twitterService.retweetOfId(params).subscribe(
        result => {
          if (!result.data.errors) {
            timeline.retweet_count = timeline.retweet_count + 1;
            this.refresh(this.userTimeLine);
          } else {
            console.log(result.data.errors);
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  /**
   * THis is for posting favorite the tweet or status
   * @param timeline this is the timeline object(tweet or status object)
   */
  public favorite(timeline: ITwitterTimelineObject) {
    console.log(timeline);
    const params = { id: timeline.id_str };
    if (timeline.favorited) {
      // postUndoFavorite
      this.twitterService.postUndoFavorite(params).subscribe(
        result => {
          if (!result.data.errors) {
            console.log(result);
            timeline.favorited = false;
            timeline.favorite_count = timeline.favorite_count - 1;
          } else {
            console.log(result.data.errors);
          }
        },
        error => {
          console.log(error);
        }
      );
    } else {
      this.twitterService.postFavorite(params).subscribe(
        result => {
          if (!result.data.errors) {
            console.log(result);
            timeline.favorited = true;
            timeline.favorite_count = timeline.favorite_count + 1;
          } else {
            console.log(result.data.errors);
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  /**
   * This function is to validate user to delete a post of his own
   * @param timeline this is the timeline object
   */
  public ValidateUserForDeleteTweet(timeline: ITwitterTimelineObject): boolean {
    // console.log(timeline.user.id);
    // console.log(this.twitterUser[0].id)
    // console.log(this.twitterUser);
    if (this.twitterUser && (this.twitterUser[0].id === timeline.user.id)) {
      return true;
    }
    return false;
  }

  /**
   * this is to reply to a tweet
   * @param event this is an input event
   * @param timeline this is tweet object of a timeline
   */
  public submitReplyTo(event: any, timeline: ITwitterTimelineObject): void {
    // console.log(timeline);
    const status = '@' + timeline.user.screen_name + ' ' + event.target.value;
    this.twitterService.postStatusOnTwitter({
      message: status,
      status_id: timeline.id_str
    }).subscribe(
      result => {
        console.log(result);
      },
      error => {
        console.log(error);
      }
    );
  }

  /** this is an event triggered when scrolled to end
   *@param event takes scroll event
  */

  public homeTimeLineScrollEvent(event): void {
    if (this.twitHomeTimeLine && this.twitHomeTimeLine.length > 0) {
      const last_index = this.twitHomeTimeLine.length - 1;
      console.log(this.twitHomeTimeLine[last_index].id);
      this.twitterService.getOldHomeTimeline(this.twitHomeTimeLine[last_index].id)
        .subscribe(
          result => {
            console.log(result.data);
            if (!result.error && result.data.length > 0) {
              this.twitHomeTimeLine = [...this.twitHomeTimeLine, ...result.data];
            }
            // console.log(this.twitHomeTimeLine);
            // console.log(this.twitHomeTimeLine);
          },
          error => {
            console.log(error);
          });
    }
  }


  /**
   * this is for getting older timeline of a user
   *  this is an event triggered when scrolled to end
   *@param event takes scroll event
  */

  public userTimeLineScrollEvent(event): void {
    if (this.twitUserTimeLine && this.twitUserTimeLine.length > 0) {
      const last_index = this.twitUserTimeLine.length - 1;
      console.log(this.twitUserTimeLine[last_index].id);
      this.twitterService.getOldUserTimeline(this.twitUserTimeLine[last_index].id)
        .subscribe(
          result => {
            console.log(result.data);
            if (!result.error && result.data.length > 0) {
              this.twitUserTimeLine = [...this.twitUserTimeLine, ...result.data];
            }
          },
          error => {
            console.log(error);
          });
    }
  }

  /**
   * this is for getting older mentions timeline of a user
   *  this is an event triggered when scrolled to end
   *@param event takes scroll event
  */

  public mentionsTimeLineScrollEvent(event): void {
    if (this.twitMentionsTimeLine && this.twitMentionsTimeLine.length > 0) {
      const last_index = this.twitMentionsTimeLine.length - 1;
      console.log(this.twitMentionsTimeLine[last_index].id);
      this.twitterService.getOldMentionsTimeline(this.twitMentionsTimeLine[last_index].id)
        .subscribe(
          result => {
            console.log(result.data);
            if (!result.error && result.data.length > 0) {
              this.twitMentionsTimeLine = [...this.twitMentionsTimeLine, ...result.data];
            }
          },
          error => {
            console.log(error);
          });
    }
  }

  /**
   *
   * @param id_str it takes twit id string object
   */
  getConversation(id_str: string, index: number): void {
    console.log(index);
    this.twitterService.getTweetStatusById(id_str)
      .subscribe(
        result => {
          console.log(result);
        },
        error => {
          console.log(error);
        }
      );
  }

  /**
   * this is for getting older mentions timeline of a user
   *  this is an event triggered when scrolled to end
   *@param event takes scroll event
  */

  public retweetsOfMeTimeLineScrollEvent(event): void {
    if (this.tweetsTimeLine && this.tweetsTimeLine.length > 0) {
      const last_index = this.tweetsTimeLine.length - 1;
      console.log(this.tweetsTimeLine[last_index].id);
      this.twitterService.getOldRetweetsOfMeTimeline(this.tweetsTimeLine[last_index].id)
        .subscribe(
          result => {
            console.log(result.data);
            if (!result.error && result.data.length > 0) {
              this.tweetsTimeLine = [...this.tweetsTimeLine, ...result.data];
            }
          },
          error => {
            console.log(error);
          });
    }
  }

  /**
   * this is to refresh streams
   * @param params it takes string of stream time
   */
  public refresh(params: string): void {
    if (params === this.retweets) {
      this.twitterService.getRetweetsTimeline()
        .subscribe(
          response => {
            console.log(response);
            this.tweetsTimeLine = response.data;
          },
          error => {
            console.log(error);
          }
        );
    } else if (params === this.userTimeLine) {
      this.twitterService.getUserTimeline()
        .subscribe(
          response => {
            console.log(response);
            this.twitUserTimeLine = response.data;
          },
          error => {
            console.log(error);
          }
        );

    } else if (params === this.homeTimeLine) {
      this.twitterService.getHomeTimeline()
        .subscribe(
          response => {
            console.log(response);
            this.twitHomeTimeLine = response.data;
          },
          error => {
            console.log(error);
          }
        );
    } else if (params === this.mentions) {
      this.twitterService.getMentionsTimeline()
        .subscribe(
          response => {
            console.log(response);
            this.twitMentionsTimeLine = response.data;
          },
          error => {
            console.log(error);
          }
        );
    }
  }

  /**
   * this is to preview the image
   * @param image it takes the image url for preview
   */
  public previewImage(timelineObject: ITwitterTimelineObject): void {

    let arrayOfImages: String[];
    console.log(timelineObject);
    if (
      timelineObject.extended_entities &&
      timelineObject.extended_entities.media &&
      timelineObject.extended_entities.media.length > 0) {
      arrayOfImages = timelineObject.extended_entities.media.map(
        image => image.media_url
      );
      console.log(arrayOfImages);
    } else if (
      !timelineObject.extended_entities
      && timelineObject.entities.media
      && timelineObject.entities.media.length > 0
    ) {
      arrayOfImages = timelineObject.entities.media.map(
        image => image.media_url
      );
    }
    const dialogRef = this.dialog.open(ImagePreviewDialogComponent, {
      width: '50%',
      data: arrayOfImages,
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  /**
   *
   * @param message this takes the message for the snackbar
   * @param action this take the text for the action for snackbar
   */
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  /**
   * this function is to display the type of data i.e a hastag description or
   * a user mention description.
   * @param event this takes mouse event to get type of request data and data
   * @param timeline this takes timeline object to match the string data to the object
   */
  public async showDescription(event: any, timeline: ITwitterTimelineObject) {

    const headersObject = {
      twitter_access_token: localStorage.getItem('twitter_access_token'),
      token_expiry_date: localStorage.getItem('token_expiry_date'),
      client_id: AppConstants.CLIENT_ID
    };
    const headers = new HttpHeaders(headersObject);
    let user_details = {};

    if (event !== undefined) {
      // console.log(timeline);
      const data = event.srcElement.className.split(' ');
      const dataString = data[0];
      // console.log(dataString);
      const dataStringType = data[1];

      if (!timeline.retweeted_status) {
        const userDetails = timeline.entities.user_mentions.filter((userdata) => userdata.screen_name === dataString);
        user_details = {
          user_id: userDetails[0].id_str,
          screen_name: userDetails[0].screen_name
        };
      } else {
        console.log(timeline.retweeted_status.user.id_str);
        user_details = {
          user_id: timeline.retweeted_status.user.id_str,
          screen_name: timeline.retweeted_status.user.screen_name
        };
      }

      const profileData = await this.getUserDetails(headers, user_details);
      this.openUserDescriptionModal(profileData);
    } else {
      // console.log(timeline);
      user_details = {
        user_id: timeline.user.id_str,
        screen_name: timeline.user.screen_name
      };
      const profileData = await this.getUserDetails(headers, user_details);
      this.openUserDescriptionModal(profileData);
    }
  }

  /**
   * @param headers this takes headers object to make an api call for getting user details
   * @param user_details this takes user details as id_str and screen name of user
   */
  public getUserDetails(headers, user_details): Promise<ITwitterUserProfile> {

    return new Promise((resolve, reject) => {
      this.twitterService.getTwitterUserProfiles(headers, user_details)
        .subscribe(
          result => {
            if (!result.error) {
              resolve(result.data[0]);
            }
          },
          error => {
            reject(error);
          }
        );
    });
  }

  /**
   * this function is to open the model dialog to show user details
   * @param obj this takse the twitter user object as user data
   */
  public openUserDescriptionModal(obj: ITwitterUser | ITwitterUserProfile) {
    if (obj) {
      let dialogInput: { platform: string, data: ITwitterUser | ITwitterUserProfile };
      dialogInput = <any>{};
      dialogInput.platform = 'twitter';
      dialogInput.data = obj;
      const dialogRef = this.dialog.open(ProfileInfoDialog, {
        panelClass: 'app-full-bleed-dialog',
        width: '45vw',
        height: '61vh',
        data: dialogInput,
      });

      // this.highLighted = 'show-class';
      dialogRef.afterClosed().subscribe(() => {
        console.log('profile dialog closed');
      });
    }
  }


  public ngOnDestroy(): void {
    this.ngUnSubScribe.next();
    this.ngUnSubScribe.complete();
  }
  @HostListener('window:scroll', ['$event'])
  doApplyFixedPosition(event) {
    this.dofix = true;
  }


}
