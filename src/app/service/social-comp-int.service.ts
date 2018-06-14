import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { IStreamComposeData } from '../model/social-common.model';

@Injectable()
export class FacebookComponentCommunicationService {

  // Observable string sources
  private socialaddStreamAnnounceCallSource = new Subject<any>();
  private fbLogincallAnnouncedConfirmed = new Subject<boolean>();
  private FBSocialComposedMessageData = new Subject<IStreamComposeData>();
  private TwitterSocialComposedMessageData = new Subject<IStreamComposeData>();
  // Observable string streams
  SoailAddStreamAnnounced$ = this.socialaddStreamAnnounceCallSource.asObservable();
  FBLoginConfirmed$ = this.fbLogincallAnnouncedConfirmed.asObservable();
  FBSocialComposedPost$ = this.FBSocialComposedMessageData.asObservable();
  TwitterSocialComposedPost$ = this.TwitterSocialComposedMessageData.asObservable();
  // Service message commands
  socialaddSocialStreamAnnounceCall(fbCall: any) {
    this.socialaddStreamAnnounceCallSource.next(fbCall);
  }
  fbLoginConfirmCall(fbAnnounce: boolean) {
    this.fbLogincallAnnouncedConfirmed.next(fbAnnounce);
  }
  // this is for composed message post
  FBSocialComposedPostAnnounce(fbPost: IStreamComposeData) {
    this.FBSocialComposedMessageData.next(fbPost);
  }
  TwitterSocialComposedPostAnnounce(fbPost: IStreamComposeData) {
    this.TwitterSocialComposedMessageData.next(fbPost);
  }
}
