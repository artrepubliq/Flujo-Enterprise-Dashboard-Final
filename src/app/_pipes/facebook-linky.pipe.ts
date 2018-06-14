import { Pipe, PipeTransform } from '@angular/core';
import { IFBFeedArray } from '../model/facebook.model';

@Pipe({
  name: 'facebookLinky'
})
export class FacebookLinkyPipe implements PipeTransform {
  transform(fbPost: IFBFeedArray , args?: any): any {
    // console.log(timeline.text);

    // console.log(timeline.entities);
    let replaceableArray: IReplaceableStrings[];
    replaceableArray = [];
    // tslint:disable-next-line:prefer-const
    let text = fbPost.message;
    const regex = /(?<=[\s>])#(\d*[A-Za-z_]+\d*)\b(?!;)/g;
    let hashTagsArray: any;
    try {
       hashTagsArray  = text.match(regex);
    } catch (err) {
      console.log(err);
    }
    /** Appending Hastags, if atweet has any */
    if (hashTagsArray && hashTagsArray.length > 0) {
      let hashIncrNo = 0;
      hashTagsArray.map((hashtag) => {
        hashIncrNo++;
        replaceableArray.push({
          replaceString: '<a class="hash' + hashIncrNo + ' " >' + hashtag + '</a>',
          matchableString: hashtag
        });
      });
    }
    /** appending the user mentions if a tweet has any */
    if (fbPost.to && fbPost.to.data.length > 0) {
      let mentionIncrNo = 0;
      fbPost.to.data.map((mention) => {
        mentionIncrNo++;
        replaceableArray.push({
          replaceString: '<a style="color: #00f" class="mention' + mentionIncrNo + ' ">' +  mention.name + '</a>',
          matchableString:  mention.name
        });
      });
    }
    /** Appending tweet urls if a tweet has any */
    // if (fbPost && fbPost.link > 0) {
    //   timeline.entities.urls.map((url) => {
    //     replaceableArray.push({
    //       replaceString: '<a target="_blank" href="' + url.url + '">' + url.display_url + '</a>',
    //       matchableString: url.url
    //     });
    //   });
    // }
    // console.log(replaceableArray);
    const Newfbpost = this.replaceMatcingString(replaceableArray, text);
    return Newfbpost;
  }

  public replaceMatcingString(tags: IReplaceableStrings[], text: string) {
    const Newfbpost = tags.reduce(
      (fbpost, replaceableObject, index) => fbpost.replace(replaceableObject.matchableString, replaceableObject.replaceString), text);
    return Newfbpost;
  }

}

export interface IReplaceableStrings {
  replaceString: string;
  matchableString: string;
}
