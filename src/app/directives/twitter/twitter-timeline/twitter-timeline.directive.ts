import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ITwitterTimelineObject, ITwitUser } from '../../../model/twitter/twitter.model';
import { TwitterServiceService } from '../../../service/twitter-service.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { TwitterUserService } from '../../../service/twitter-user.service';


@Component({
  selector: 'app-twitter-timeline',
  templateUrl: './twitter-timeline.directive.html',
  styleUrls: ['./twitter-timeline.directive.scss']
})
// tslint:disable-next-line:component-class-suffix
export class TwitterTimelineDirective implements OnInit, OnDestroy {
  subscription: Subscription;
  twituser: Observable<ITwitUser>;
  public config: any;
  private ngUnSubScribe = new Subject();
  @Input() twitTimeLine: ITwitterTimelineObject[];
  @Input() header_title: string;
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
    console.log(this.twitterUserService.getTwitterData);
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
            timeline.retweet_count = result.data.retweet_count;
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

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.ngUnSubScribe.next();
    this.ngUnSubScribe.complete();
  }


}
