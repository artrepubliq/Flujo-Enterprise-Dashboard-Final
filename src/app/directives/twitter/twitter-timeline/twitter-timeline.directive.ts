import { Component, OnInit, Input } from '@angular/core';
import { ITwitterTimelineObject } from '../../../model/twitter/twitter.model';

@Component({
  selector: 'app-twitter-timeline',
  templateUrl: './twitter-timeline.directive.html',
  styleUrls: ['./twitter-timeline.directive.scss']
})
// tslint:disable-next-line:component-class-suffix
export class TwitterTimelineDirective implements OnInit {
  public config: any;

  @Input() twitTimeLine: ITwitterTimelineObject[];
  constructor() { }

  ngOnInit() {
    console.log((this.twitTimeLine));
    this.twitTimeLine.map(object => {
      if (object.entities.media) {
        console.log(object.entities.media[0].media_url);
      }
      const now = Date.now();
      console.log(now);
    });

  }

}
