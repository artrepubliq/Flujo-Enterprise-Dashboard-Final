import { Component, OnInit, Input } from '@angular/core';
import { ITwitterTimelineObject } from '../../../model/twitter/twitter.model';
import { TwitterServiceService } from '../../../service/twitter-service.service';

@Component({
  selector: 'app-twitter-timeline',
  templateUrl: './twitter-timeline.directive.html',
  styleUrls: ['./twitter-timeline.directive.scss']
})
// tslint:disable-next-line:component-class-suffix
export class TwitterTimelineDirective implements OnInit {
  public config: any;

  @Input() twitTimeLine: ITwitterTimelineObject[];
  @Input() header_title: string;
  constructor(
    private twitterService: TwitterServiceService
  ) { }

  ngOnInit() {
    console.log((this.twitTimeLine));
    // this.twitTimeLine.map(object => {
    //   // if (object.entities.media) {
    //   //   console.log(object.entities.media[0].media_url);
    //   // }
    //   // const now = Date.now();
    //   // console.log(now);
    // });
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


}
