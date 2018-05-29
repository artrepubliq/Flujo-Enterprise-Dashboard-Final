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
import { ITwitterTimelineObject, ITwitUser, ITwitterUserProfile, ITwitTimeLineObject } from '../../../model/twitter/twitter.model';


@Component({
  selector: 'app-twitter-timeline',
  templateUrl: './twitter-timeline.directive.html',
  styleUrls: ['./twitter-timeline.directive.scss']
})
// tslint:disable-next-line:component-class-suffix
export class TwitterTimelineDirective implements OnInit, OnDestroy {
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
    private twitterUserService: TwitterUserService
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
          } else {
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
    if (timeline.user.id === this.twitterUser[0].id) {
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
    const last_index = this.twitHomeTimeLine.length - 1;
    console.log(this.twitHomeTimeLine[last_index].id);
    this.twitterService.getOldHomeTimeline(this.twitHomeTimeLine[last_index].id)
      .subscribe(
        result => {
          console.log(result.data);
          if (!result.error) {
            this.twitHomeTimeLine = [...this.twitHomeTimeLine, ...result.data];
          }
          // console.log(this.twitHomeTimeLine);
          // console.log(this.twitHomeTimeLine);
        },
        error => {
          console.log(error);
        });
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

  public ngOnDestroy(): void {
    this.ngUnSubScribe.next();
    this.ngUnSubScribe.complete();
  }
  @HostListener('window:scroll', ['$event'])
  doApplyFixedPosition(event) {
    this.dofix = true;
  }


}
