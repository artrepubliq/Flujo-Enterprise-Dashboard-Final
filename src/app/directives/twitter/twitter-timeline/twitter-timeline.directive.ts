import { Component, OnInit, Input } from '@angular/core';
import { ITwitterTimelineObject } from '../../../model/twitter/twitter.model';

@Component({
  selector: 'app-twitter-timeline',
  templateUrl: './twitter-timeline.directive.html',
  styleUrls: ['./twitter-timeline.directive.scss']
})
// tslint:disable-next-line:component-class-suffix
export class TwitterTimelineDirective implements OnInit {

  @Input() twitTimelineData: ITwitterTimelineObject[];
  constructor() { }

  ngOnInit() {
    console.log((this.twitTimelineData));
    this.twitTimelineData.map( object => {
      console.log(object.created_at);
    });
  }

}
