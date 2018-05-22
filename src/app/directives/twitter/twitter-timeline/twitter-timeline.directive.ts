import { Component, OnInit, Input, HostListener } from '@angular/core';
import { ITwitterTimelineObject } from '../../../model/twitter/twitter.model';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import {ScrollDispatchModule} from '@angular/cdk/scrolling';

@Component({
  selector: 'app-twitter-timeline',
  templateUrl: './twitter-timeline.directive.html',
  styleUrls: ['./twitter-timeline.directive.scss']
})
// tslint:disable-next-line:component-class-suffix
export class TwitterTimelineDirective implements OnInit {
  public config: any;
  dofix: boolean;

  @Input() twitTimeLine: ITwitterTimelineObject[];
  @Input() header_title: string;
  constructor() { }

  ngOnInit() {
    console.log((this.twitTimeLine));
    this.twitTimeLine.map(object => {
      // if (object.entities.media) {
      //   console.log(object.entities.media[0].media_url);
      // }
      // const now = Date.now();
      // console.log(now);
    });

  }
  @HostListener('window:scroll', ['$event'])
  doApplyFixedPosition(event) {
    this.dofix = true;
  }

}
