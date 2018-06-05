import { Pipe, PipeTransform } from '@angular/core';
import { ITwitterTimelineObject } from '../model/twitter/twitter.model';

@Pipe({
  name: 'twitterLinky'
})
export class TwitterLinkyPipe implements PipeTransform {

  transform(timeline: ITwitterTimelineObject, args?: any): any {
    // console.log(timeline.text);

    // console.log(timeline.entities);
    let replaceableArray: IReplaceableStrings[];
    replaceableArray = [];
    let text = timeline.text;

    /** this is to splice off the media url  */
    if (timeline.extended_entities && timeline.extended_entities.media && timeline.extended_entities.media.length > 0) {
      text = timeline.extended_entities.media.reduce((newtext, media) => text.replace(media.url, ''), text);
    }
    /** Appending Hastags, if atweet has any */
    if (timeline.entities.hashtags && timeline.entities.hashtags.length > 0) {
      timeline.entities.hashtags.map((hashtag) => {
        replaceableArray.push({
          replaceString: '<a href="" target="_blank">' + '#' + hashtag.text + '</a>',
          matchableString: '#' + hashtag.text
        });
      });
    }
    /** appending the user mentions if a tweet has any */
    if (timeline.entities.user_mentions && timeline.entities.user_mentions.length > 0) {
      timeline.entities.user_mentions.map((mention) => {
        replaceableArray.push({
          replaceString: '<a href="" target="_blank">' + '@' + mention.screen_name + '</a>',
          matchableString: '@' + mention.screen_name
        });
      });
    }
    /** Appending tweet urls if a tweet has any */
    if (timeline.entities.urls && timeline.entities.urls.length > 0) {
      timeline.entities.urls.map((url) => {
        replaceableArray.push({
          replaceString: '<a target="_blank" href="' + url.url + '">' + url.display_url + '</a>',
          matchableString: url.url
        });
      });
    }
    /** Appending tweet urls in extendend entities if a tweet has any */
    // if (timeline.extended_entities && timeline.extended_entities.media && timeline.extended_entities.media.length > 0) {
    //   timeline.extended_entities.media.map((media) => {
    //     replaceableArray.push({
    //       replaceString: '<a target="_blank" href="' + media.url + '">' + media.display_url + '</a>',
    //       matchableString: media.url
    //     });
    //   });
    // }
    // console.log(replaceableArray);
    const newTweet = this.replaceMatcingString(replaceableArray, text);
    return newTweet;
  }

  public ReplaceAt(input: string, search: string, replace: string, start: number, end: number) {
    return input.slice(0, start) + input.slice(start, end).replace(search, replace) + input.slice(end);
  }

  public replaceMatcingString(tags: IReplaceableStrings[], text: string) {
    const newTweet = tags.reduce(
      (tweet, replaceableObject, index) => tweet.replace(replaceableObject.matchableString, replaceableObject.replaceString), text);
    console.log(newTweet);
    return newTweet;
  }

}

export interface IReplaceableStrings {
  replaceString: string;
  matchableString: string;
}
