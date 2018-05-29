import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { IStreamComposeData } from '../model/social-common.model';

@Injectable()
export class FacebookComponentCommunicationService {

  // Observable string sources
  private fbcallAnnouncedSource = new Subject<string>();
  private fbcallConfirmedSource = new Subject<string>();
  private fbComposedMessageData = new Subject<IStreamComposeData>();
  // Observable string streams
  FBAnnounced$ = this.fbcallAnnouncedSource.asObservable();
  FBConfirmed$ = this.fbcallAnnouncedSource.asObservable();
  FBComposedPost$ = this.fbComposedMessageData.asObservable();
  // Service message commands
  fbAnnounceCall(fbCall: string) {
    this.fbcallAnnouncedSource.next(fbCall);
  }
  fbConfirmCall(fbAnnounce: string) {
    this.fbcallAnnouncedSource.next(fbAnnounce);
  }
  // this is for composed message post
  fbComposedPostAnnounce(fbPost: IStreamComposeData) {
    this.fbComposedMessageData.next(fbPost);
  }
}
