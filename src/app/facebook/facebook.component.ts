import { Component, OnInit, Input } from '@angular/core';
import { FBService } from '../service/fb.service';
import { FacebookService, InitParams, LoginResponse, LoginOptions } from 'ngx-facebook';
import * as _ from 'underscore';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material';
import { AddSocialStreemDialog } from '../dialogs/social-addstreem/social-addstreem.dialog';
import { FacebookComponentCommunicationService } from '../service/social-comp-int.service';
import { Subscription } from 'rxjs/Subscription';
import { IStreamComposeData, IStreamDetails, IComposePost, ILoggedInUsersAccounts } from '../model/social-common.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AppConstants } from '../app.constants';
import { ICommonInterface } from '../model/commonInterface.model';
import { EditFacebookMessage } from '../dialogs/edit-fb-post/edit-fb-post-dialog';
import { ImagePreviewDialogComponent } from '../dialogs/image-preview-dialog/image-preview-dialog.component';
import {
  IFBPages, IProfile, IFBPagesList, IMediaData, IFBFeedArray,
  IFBFeedResponse, IPaginigCursors, IToPersonDetails, IFBSessionExpired, IFBError
} from '../model/facebook.model';
import * as moment from 'moment';
import { ProfileInfoDialog } from '../dialogs/profile-info/profile-info.dialog';
import { PostCommentCompose } from '../dialogs/post-comment/post-comment.dialog';
import { Router } from '@angular/router';
import { AlertService } from 'ngx-alerts';
@Component({
  selector: 'app-facebook',
  templateUrl: './facebook.component.html',
  styleUrls: ['./facebook.component.scss', '../social-management/social-management.component.scss']
})
export class FacebookComponent implements OnInit {
  FBAPI = 'https://graph.facebook.com/v3.0/';
  showProgressBarValue = 0;
  displayTextOnlyForHomeTimeline = false;
  displayTextOnlyForMyPosts = false;
  displayTextOnlyForTaggedPosts = false;
  currentStreamDetails: IFBPages;
  FBMyPostsNextURL: any;
  FBTaggedPostsNextURL: any;
  FBHomeTimelineNextPostURL: any;
  test = true;
  photoData: Blob;
  commentInput = '';
  uploadPhotosformData = new FormData();
  FBHomeTimelinePosts: IFBFeedArray[];
  FBTaggedPosts: IFBFeedArray[];
  FBMyPosts: IFBFeedArray[];
  FBPageHoleFeedData: IFBFeedResponse;
  ProfileData: IProfile;
  fbNextPage: IPaginigCursors;
  fbResponseData: IFBFeedArray;
  fbResponseDataItems: Array<IFBFeedArray>;
  fbPagesList: IFBPagesList;
  isFbLogedin = false;
  highLighted = '';
  subscription: Subscription;
  @Input() FbLongLivedToken: string;
  @Input() tabIndex: any;
  userAccountId: string;
  constructor(public dialog: MatDialog, private fbService: FBService,
    private httpClient: HttpClient,
    private router: Router,
    private fb: FacebookService,
    private alertService: AlertService,
    private fbCMPCommunicationService: FacebookComponentCommunicationService) {
    this.subscription = fbCMPCommunicationService.SoailAddStreamAnnounced$.subscribe(
      fbAccountsData => {
        this.openAddSocialStreamsDialog(fbAccountsData);
      });
    this.subscription = fbCMPCommunicationService.FBSocialComposedPost$.subscribe(
      fbComposedPost => {
        this.handleComposedFBPost(fbComposedPost);
      });

    this.showProgressBarValue = 0;
  }

  ngOnInit() {
    if (this.FbLongLivedToken.length > 0) {
      this.startWithFacebook(this.FbLongLivedToken);
    }
  }
  startWithFacebook = async (FbLongLivedToken) => {

    const profile: any = await this.getUserProfile(FbLongLivedToken);
    this.currentStreamDetails = profile;
    if (profile) {
      this.showProgressBarValue = 0;
      this.getUserHomeORPageTimeline(profile);
      this.getUserHomeORPageMyPosts(profile);
      this.getUserHomeORPageTaggedPosts(profile);
    } else {
      alert('not logged in');
    }
  }

  scrollLoadMoreToRefresh = async (event) => {
    this.showProgressBarValue = 0;
    if (event === 1 && this.FBHomeTimelineNextPostURL) {
      const result: IFBFeedResponse = await this.FBAPICallOnLoadMoreRefreshedDataFromFB(this.FBHomeTimelineNextPostURL);
      if (result.paging && result.paging.next) {
        this.FBHomeTimelineNextPostURL = result.paging.next;
      } else {
        this.FBHomeTimelineNextPostURL = '';
      }
      this.FBHomeTimelinePosts = [...this.FBHomeTimelinePosts, ...result.data];
    } else if (event === 2 && this.FBTaggedPostsNextURL) {
      const result: IFBFeedResponse = await this.FBAPICallOnLoadMoreRefreshedDataFromFB(this.FBTaggedPostsNextURL);
      if (result.paging && result.paging.next) {
        this.FBTaggedPostsNextURL = result.paging.next;
      } else {
        this.FBTaggedPostsNextURL = '';
      }
      this.FBTaggedPosts = [...this.FBTaggedPosts, ...result.data];
    } else if (event === 3 && this.FBMyPostsNextURL) {
      const result: IFBFeedResponse = await this.FBAPICallOnLoadMoreRefreshedDataFromFB(this.FBMyPostsNextURL);
      if (result.paging && result.paging.next) {
        this.FBMyPostsNextURL = result.paging.next;
      } else {
        this.FBMyPostsNextURL = '';
      }
      this.FBMyPosts = [...this.FBMyPosts, ...result.data];
    } else {
      this.showProgressBarValue = 100;
    }
  }
  //  THIS FUNCTION IS USED FOR OPEN THE PREVIEW DIALOG AND DISPLAY THE IMAGES
  public previewImage(previewImages: IMediaData[], full_picture: any): void {
    let arrayOfImages: String[];
    if (previewImages && previewImages.length > 0) {
      arrayOfImages = previewImages.map(image => image.media.image.src);
    } else {
      arrayOfImages = [];
      arrayOfImages.push(full_picture);
    }
    const dialogRef = this.dialog.open(ImagePreviewDialogComponent, {
      width: '50%',
      data: arrayOfImages,
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  // open the dialog for adding the social streams
  openAddSocialStreamsDialog = (accounts: ILoggedInUsersAccounts) => {
    const dialogRef = this.dialog.open(AddSocialStreemDialog, {
      panelClass: 'app-full-bleed-dialog',
      width: '45vw',
      height: '61vh',
      data: accounts,
    });
    this.highLighted = 'show-class';
    dialogRef.afterClosed().subscribe((result: any) => {
      this.currentStreamDetails = result;
      if (result && result.id) {
        this.clearCurrentStreamObjects();
        this.getUserPageProfile(result);
        this.getUserHomeORPageTimeline(result);
        this.getUserHomeORPageMyPosts(result);
        this.getUserHomeORPageTaggedPosts(result);
      }
      this.highLighted = 'hide-class';
    });
  }
  // THIS FUNCTION IS USED TO CLEAR ALL THE OBJECTS OF CURRENT STREAM
  clearCurrentStreamObjects = () => {
    this.ProfileData = null;
    this.FBTaggedPosts = null;
    this.FBHomeTimelinePosts = null;
    this.FBMyPosts = null;
    this.FBHomeTimelineNextPostURL = '';
    this.FBMyPostsNextURL = '';
    this.FBTaggedPostsNextURL = '';
  }
  openProfileInfoDialog = (stream: IFBFeedArray, event: any) => {
    const keyElemet: string = event.srcElement.className;
    if (stream.to && stream.to.data && keyElemet.includes('mention')) {
      const mentionsplit = keyElemet.split('mention');
      let obj: { 'key': number, 'personDetail': IToPersonDetails };
      obj = <any>{};
      obj.key = Number(mentionsplit[1]);
      obj.personDetail = stream.to.data[(Number(mentionsplit[1])) - 1];
      const dialogRef = this.dialog.open(ProfileInfoDialog, {
        panelClass: 'app-full-bleed-dialog',
        width: '45vw',
        height: '61vh',
        data: obj,
      });
      this.highLighted = 'show-class';
      dialogRef.afterClosed().subscribe(() => {
        console.log('profile dialog closed');
      });
    }
  }
  openCommentDialog = (postDetails: IFBFeedArray) => {
    let dialogData: { 'profile': IProfile, 'postDetails': IFBFeedArray };
    if (postDetails && postDetails.id) {
      dialogData = <any>{};
      dialogData.profile = this.ProfileData;
      dialogData.postDetails = postDetails;
      const dialogRef = this.dialog.open(PostCommentCompose, {
        panelClass: 'app-full-bleed-dialog',
        width: '45vw',
        height: '61vh',
        data: dialogData,
      });
      this.highLighted = 'show-class';
      dialogRef.afterClosed().subscribe(async (commentObj) => {
        console.log(commentObj);
        let streamItem: IStreamDetails;
        if (commentObj.media && commentObj.media.length > 0) {
          streamItem = <IStreamDetails>{};
          streamItem.access_token = this.currentStreamDetails.access_token;
          streamItem.social_id = this.currentStreamDetails.social_id;
          streamItem.imageUploadFailedItem = [];
          streamItem.imageUploadSuccessItem = [];
          const fbPhotoUploadResp: any = await this.asyncThreadToUploadTheImagesToFB(commentObj.media, streamItem);
          console.log(fbPhotoUploadResp);
          // tslint:disable-next-line:max-line-length
          if (fbPhotoUploadResp && fbPhotoUploadResp.imageUploadSuccessItem.length > 0 && fbPhotoUploadResp.imageUploadFailedItem.length === 0) {
            const newCommentObject = this.prepareCommentObject(streamItem, commentObj);
            console.log(newCommentObject);
            this.postCommentForAUserPagePost(postDetails, newCommentObject);
          } else {
            this.alertService.danger('Image upload failed for a comment');
          }
        } else {
          streamItem = <IStreamDetails>{};
          streamItem.access_token = this.currentStreamDetails.access_token;
          streamItem.social_id = this.currentStreamDetails.social_id;
          const newCommentObject = this.prepareCommentObject(streamItem, commentObj);
          console.log(newCommentObject);
          this.postCommentForAUserPagePost(postDetails, newCommentObject);
        }
      });
    }
  }
  getUserProfile = (FbLongLivedToken) => {
    this.showProgressBarValue = 0;
    return new Promise((resolve, reject) => {
      // tslint:disable-next-line:max-line-length
      this.fb.api('https://graph.facebook.com/v3.0/me?fields=id,name,picture{url}&access_token=' + FbLongLivedToken, 'get')
        .then((profile_res: IProfile) => {
          this.ProfileData = profile_res;
          this.userAccountId = profile_res.id;
          let useraccount: IFBPages;
          useraccount = <IFBPages>{};
          useraccount.access_token = FbLongLivedToken;
          useraccount.social_id = profile_res.id;
          useraccount.name = profile_res.name;
          this.showProgressBarValue = 100;
          resolve(useraccount);
        })
        .catch((errResp: any) => {
          console.log(errResp);
          this.sessionExpiredSOGotoLogin(errResp);
          this.showProgressBarValue = 100;
          this.alertService.danger('Your session has expired. Please login with facebook.');
          reject(errResp);
        });
    });
  }
  getUserPageProfile = (streamDetails: IFBPages) => {
    // tslint:disable-next-line:max-line-length
    this.fb.api(this.FBAPI + streamDetails.social_id + '?fields=id,name,picture{url}&access_token=' + streamDetails.access_token, 'get')
      .then((profile_res: IProfile) => {
        this.ProfileData = profile_res;
      })
      .catch((err: any) => {
        console.log(err);
        this.sessionExpiredSOGotoLogin(err);
      });
  }

  // THIS FUNCTION IS USED FOR GETTING THE LOAD MORE REFRESHED DATA
  FBAPICallOnLoadMoreRefreshedDataFromFB = (url: any): Promise<any> => {
    this.showProgressBarValue = 0;
    if (url.length > 0) {
      return new Promise((resolve, reject) => {
        this.fb.api(url, 'get')
          .then((data: IFBFeedResponse) => {
            this.showProgressBarValue = 100;
            resolve(data);
          })
          .catch((errResp: any) => {
            this.showProgressBarValue = 100;
            reject(errResp);
          });
      });
    } else {
      this.showProgressBarValue = 100;
    }
  }

  // THIS FUNCTION IS USED TO GET ALL THE HOME FEED IF THE USER
  getUserHomeORPageTimeline = (streamDetails: IFBPages) => {
    this.showProgressBarValue = 0;
    // tslint:disable-next-line:max-line-length
    this.fb.api(this.FBAPI + streamDetails.social_id + '/feed?fields=parent_id,link,to{id,link,name,pic_large,pic_small,profile_type,username},created_time,description,full_picture,attachments{subattachments},message,shares,comments.summary(true),likes.summary(true)&limit=25&access_token=' + streamDetails.access_token, 'get')
      .then((userHomeFeed: IFBFeedResponse) => {
        this.FBHomeTimelinePosts = userHomeFeed.data;
        if (userHomeFeed && userHomeFeed.paging && userHomeFeed.paging.next) {
          this.FBHomeTimelineNextPostURL = userHomeFeed.paging.next;
        } else {
          this.FBHomeTimelineNextPostURL = '';
        }
        this.showProgressBarValue = 100;
      })
      .catch((e: any) => {
        console.log(e);
        this.showProgressBarValue = 100;
      });
  }
  // THIS FUNCTION IS USED TO GET TAGGED POST FROM THE USER HOME PROFILE
  getUserHomeORPageTaggedPosts = (streamDetails: IFBPages) => {
    this.showProgressBarValue = 0;
    // tslint:disable-next-line:max-line-length
    this.fb.api(this.FBAPI + streamDetails.social_id + '/tagged?fields=parent_id,link,full_picture,to{id,link,name,pic_large,pic_small,profile_type,username},message,created_time,shares,comments.summary(true),likes.summary(true)&limit=25&access_token=' + streamDetails.access_token, 'get')
      .then((taggedPosts: IFBFeedResponse) => {
        this.FBTaggedPosts = taggedPosts.data;
        console.log(this.FBTaggedPosts);
        if (taggedPosts && taggedPosts.paging && taggedPosts.paging.next) {
          this.FBTaggedPostsNextURL = taggedPosts.paging.next;
        }
        this.showProgressBarValue = 100;
      })
      .catch((err: any) => {
        console.log(err);
        this.alertService.danger('Failed to get Tagged posts.');
        this.sessionExpiredSOGotoLogin(err);
        this.showProgressBarValue = 100;
      });
  }
  // THIS FUNCTION IS USED TO GET SHARED POST FROM THE USER HOME PROFILE
  getUserHomeORPageMyPosts = (streamDetails: IFBPages) => {
    this.showProgressBarValue = 0;
    // tslint:disable-next-line:max-line-length
    this.fb.api(this.FBAPI + streamDetails.social_id + '/posts?fields=parent_id,link,to{id,link,name,pic_large,pic_small,profile_type,username},created_time,description,full_picture,message,shares,comments.summary(true),likes.summary(true)&limit=25&access_token=' + streamDetails.access_token, 'get')
      .then((myPost: IFBFeedResponse) => {
        if (myPost && myPost.paging && myPost.paging.next) {
          this.FBMyPostsNextURL = myPost.paging.next;
        }
        // const filteredmyPost: IFBFeedArray[] = _.filter(myPost.data, (object) => {
        //   return !object.parent_id;
        // });
        this.FBMyPosts = myPost.data;
        this.showProgressBarValue = 100;
      })
      .catch((e: any) => {
        console.log(e);
        this.alertService.danger('Failed to get Posts.');
        this.showProgressBarValue = 100;
        this.sessionExpiredSOGotoLogin(e);
      });
  }
  // THIS FUNCTION IS USED TO GET ALL THE PAGES WHICH HAVE LINKED WITH USER PROFILE
  addSocialStream = (token) => {
    // if (!this.fbPagesList) {
    //   this.fb.api('https://graph.facebook.com/v3.0/me?fields=accounts,id,name&access_token=' + token, 'get')
    //   .then((accountResp: IMyAccounts) => {
    //     let useraccount: IFBPages;
    //     useraccount = <IFBPages>{};
    //     useraccount.access_token = token;
    //     useraccount.id = accountResp.id;
    //     useraccount.name = accountResp.name;
    //     this.fbPagesList = accountResp.accounts;
    //     this.fbPagesList.data.push(useraccount);
    // this.openAddSocialStreamsDialog(this.fbPagesList.data);
    //     })
    //     .catch((e: any) => {
    //       console.log(e);
    //     });
    // } else {
    //   this.openAddSocialStreamsDialog(this.fbPagesList.data);
    // }
  }
  // THIS FUNCTION IS USED TO PUBLISH THE LIKE OR DIS-LIKE THE POST
  likeORDislikeThePost = (post: IFBFeedArray) => {
    if (post.likes.summary.can_like && !post.likes.summary.has_liked) {
      this.LikeForAUserPagePost(post);
    } else {
      this.disLikeTheLikedPost(post);
    }
  }
  // THIS FUNCTION IS USED TO POST THE LIKE FOR FACEBOOK PAGE POST.
  LikeForAUserPagePost = (post: IFBFeedArray) => {
    this.showProgressBarValue = 0;
    this.fb.api(this.FBAPI + post.id + '/likes?access_token=' + this.currentStreamDetails.access_token, 'post')
      .then((res: any) => {
        this.refreshAllCurrentStreams([]);
        console.log(res);
        this.showProgressBarValue = 100;
        this.alertService.success('You have Liked the post Successfully.');
      })
      .catch((err: any) => {
        this.sessionExpiredSOGotoLogin(err);
        this.alertService.danger('Failed to Like the post. Try Again..');
        this.showProgressBarValue = 100;
      });
  }
  // THIS FUNCTION IS USED TO UNLIKE THE LIKE.
  disLikeTheLikedPost = (post: IFBFeedArray) => {
    this.showProgressBarValue = 0;
    this.fb.api(this.FBAPI + post.id + '/likes?access_token=' + this.currentStreamDetails.access_token, 'delete')
      .then((res: any) => {
        this.refreshAllCurrentStreams([]);
        console.log(res);
        this.showProgressBarValue = 100;
        this.alertService.success('You have Un-Liked the post Successfully.');
      })
      .catch((e: any) => {
        this.showProgressBarValue = 100;
        console.log(e);
        this.sessionExpiredSOGotoLogin(e);
        this.alertService.danger('Failed to Un-Like the post. Try Again..');
      });
  }
  // THIS FUNCTION IS USED TO POST THE COMMENT FOR FACEBOOK PAGE POST
  postCommentForAUserPagePost = (postDetails: IFBFeedArray, newCommentObject, ) => {
    this.showProgressBarValue = 0;
    this.fb.api('https://graph.facebook.com/' + postDetails.id + '/comments?access_token=' + this.currentStreamDetails.access_token,
      'post', newCommentObject)
      .then((respo: any) => {
        this.refreshAllCurrentStreams([]);
        this.commentInput = '';
        console.log(respo);
        this.showProgressBarValue = 100;
        this.alertService.success('You have Commented this post Successfully.');
      })
      .catch((err: any) => {
        console.log(err);
        this.sessionExpiredSOGotoLogin(err);
        this.alertService.danger('Failed to Comment this post. Try Again..');
        this.showProgressBarValue = 100;
      });
  }
  // THIS FUNCTION IS USED TO  SHARE THE FACEBOOK POST FROM THE PAGE
  postShareAUserPagePost = (post: IFBFeedArray) => {
    if (!post.parent_id) {
      this.showProgressBarValue = 0;
      const postID = post.id.split('_');
      // tslint:disable-next-line:max-line-length
      this.fb.api(this.FBAPI + postID[0] + '/feed?link=https://www.facebook.com/' + postID[1] + '&access_token=' + this.currentStreamDetails.access_token, 'post')
        .then((res: any) => {
          console.log(res.data);
          this.refreshAllCurrentStreams([]);
          this.showProgressBarValue = 100;
          this.alertService.success('You have Shared this post Successfully');
        })
        .catch((err: any) => {
          console.log(err);
          this.sessionExpiredSOGotoLogin(err);
          this.showProgressBarValue = 100;
          this.alertService.danger('Failed to share the post. Try Again...');
        });
    }
  }
  // THIS FUNCTION IS USED TO HANDLE ALL THE FUNCTIONALITIES REQUIRED TO POST THE FB POST
  handleComposedFBPost = async (composedFBPost: IStreamComposeData) => {
    this.showProgressBarValue = 0;
    try {
      if (composedFBPost.composedMessage.media.length > 0) {
        const photoUploadResp: IStreamComposeData = await this.addPhotosToFBUserPageOrHomePhotos(composedFBPost);
        console.log(photoUploadResp);
        const addFBPostResp: any[] = await this.asyncThreadToAddFacebookPost(photoUploadResp);
        console.log(addFBPostResp);
        this.showProgressBarValue = 100;
        this.refreshAllCurrentStreams(composedFBPost.streamDetails);
        if (addFBPostResp.length === composedFBPost.streamDetails.length) {
          this.alertService.success('Post has been published successfully.');
          this.deleteuploadedImagesFromServer(composedFBPost.composedMessage.media);
        } else {
          console.log('error in facebook component handlecomposedPost');
          this.alertService.danger('Failed to publish the post. Try Again...');
          alert('failed to post the Post.');
        }
      } else {
        const addFBPostResp: any[] = await this.asyncThreadToAddFacebookPost(composedFBPost);
        this.showProgressBarValue = 100;
        if (addFBPostResp[0].postStatus) {
          this.alertService.success('Post has been published successfully.');
        } else {
          this.alertService.danger('post has not published. Please try again...');
        }
        this.refreshAllCurrentStreams(composedFBPost.streamDetails);
      }
    } catch (err) {
      console.log(err);
    }

  }
  refreshAllCurrentStreams = (inputStreamDetails: IStreamDetails[]) => {
    if (_.some(inputStreamDetails, (item: IStreamDetails) => {
      console.log(item.social_id);
      return item.social_id === this.currentStreamDetails.social_id;
    })) {
      this.getUserHomeORPageMyPosts(this.currentStreamDetails);
      this.getUserHomeORPageTaggedPosts(this.currentStreamDetails);
      this.getUserHomeORPageTimeline(this.currentStreamDetails);
    } else {
      console.log(inputStreamDetails);
      this.getUserHomeORPageMyPosts(this.currentStreamDetails);
      this.getUserHomeORPageTaggedPosts(this.currentStreamDetails);
      this.getUserHomeORPageTimeline(this.currentStreamDetails);
    }
  }
  // THIS FUNCTION IS USED TO POST THE FB POST IN ALL THE SELECTED STREAMS
  asyncThreadToAddFacebookPost = (fbPost: IStreamComposeData): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      try {
        const fbImgUploadResp = await fbPost.streamDetails.reduce((promise, streamItem, index) =>
          promise.then(async (arr) => [...arr, await this.asyncFBAPICALLThreadToPostTheFBPost(streamItem, fbPost.composedMessage)]),
          Promise.resolve([]));
        resolve(fbImgUploadResp);
      } catch (url) {
        this.showProgressBarValue = 100;
        alert('Failed to publish the post');
      }
    });
  }
  // THIS FACEBOOK API CALL SERVICE TO POST THE FB POST ON TO SELECTED PAGE OR PROFILE
  asyncFBAPICALLThreadToPostTheFBPost = (streamItem: IStreamDetails, composedPost: IComposePost) => {
    return new Promise(async (resolve, reject) => {
      let fbPostObject: any;
      if (streamItem.imageUploadFailedItem && streamItem.imageUploadFailedItem.length === 0 &&
        streamItem.imageUploadSuccessItem && streamItem.imageUploadSuccessItem.length > 0) {
        fbPostObject = this.prepareFBPostObject(streamItem, composedPost);

      } else {
        fbPostObject = this.prepareFBPostObject(streamItem, composedPost);
      }
      console.log(fbPostObject);
      if (fbPostObject) {
        this.fb.api(this.FBAPI + streamItem.social_id + '/feed?access_token=' + streamItem.access_token,
          'post', fbPostObject)
          .then((respo: any) => {
            streamItem.postStatus = true;
            streamItem.post_id = respo.id;
            resolve(streamItem);
          })
          .catch((err: any) => {
            console.log(err);
            this.sessionExpiredSOGotoLogin(err);
            streamItem.postStatus = false;
            streamItem.post_id = '';
            reject(streamItem);
          });
      } else {
        this.showProgressBarValue = 100;
      }
    });
  }

  // THIS FUNCTION IS USED FOR UPLOAD THE IMAGES TO THE SELECETED PAGE OR PROFILR
  addPhotosToFBUserPageOrHomePhotos = (composeData: IStreamComposeData): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      const allStreamsResp = [];
      for (let streamItem of composeData.streamDetails) {
        streamItem = streamItem;
        let streamResponse: any;
        try {
          streamResponse = await this.asyncThreadToUploadTheImagesToFB(composeData.composedMessage.media, streamItem);
          console.log(streamResponse);
          allStreamsResp.push(streamResponse);
          if (allStreamsResp.length === composeData.streamDetails.length) {
            composeData.streamDetails = allStreamsResp;
            resolve(composeData);
          }
        } catch (err) {
          console.log(err);
          alert('Photo upload to fb failed.');
        }
      }
    });
  }
  // THIS FUNCTION IS USED TO UPLOAD THE ALL THE IMAGES AND GIVES THE HOLE UPLOAD RESPONSE BACK.
  asyncThreadToUploadTheImagesToFB = async (mediaUrls, streamItem: IStreamDetails) => {
    return new Promise(async (resolve, reject) => {
      let fbImgUploadResp: any;
      console.log(streamItem);
      try {
        fbImgUploadResp = await mediaUrls.reduce((promise, urlItem, index) =>
          promise.then(async (arr) => [...arr, await this.APICallToUploadLocalPhotosToFacebook(streamItem, urlItem)]), Promise.resolve([]));
        console.log(fbImgUploadResp);
        _.each(fbImgUploadResp, (iteratee) => {
          if (iteratee.published) {
            streamItem.imageUploadSuccessItem.push(iteratee.url);
          } else {
            streamItem.imageUploadFailedItem.push(iteratee.url);
          }
        });
        resolve(streamItem);
      } catch (url) {
        console.log(url);
        alert('failed to upload images.');
      }
    });
  }
  // THIS FUNCTION IS USED TO UPLOAD THE PHOTOS TO THE FACEBOOK PROFILE OR PAGE
  APICallToUploadLocalPhotosToFacebook = async (streamItem: IStreamDetails, urlItem) => {
    return new Promise(async (resolve, reject) => {
      let photoObject: { 'published': boolean, 'url': any };
      photoObject = <any>{};
      photoObject.published = false;
      photoObject.url = urlItem;
      this.fb.api(this.FBAPI + streamItem.social_id + '/photos?access_token=' + streamItem.access_token,
        'post', photoObject)
        .then((fbPhotoId: any) => {
          photoObject.published = true;
          photoObject.url = fbPhotoId.id;
          resolve(photoObject);
        })
        .catch((err: any) => {
          photoObject.published = false;
          photoObject.url = urlItem;
          this.sessionExpiredSOGotoLogin(err);
          resolve(photoObject);
        });
    });
  }
  // FUNCTION IS USED TO DELETE THE FACEBOOK POST FROM THE USER PAGE OR PROFILE
  deleteFBPostFromUserHomeOrPageTimeline = async (postDetails: IFBFeedArray) => {
    try {

      const result = await this.asyncThreadFBAPICallToDeleteTheFacebookPost(postDetails.id);
      this.refreshAllCurrentStreams([]);
      this.alertService.success('You have Deleted the post Successfully');
    } catch (err) {
      this.alertService.danger('Failed to Delete the post. Try Again...');
    }
  }
  // FUNCTION IS USED TO DELETE THE FACEBOOK POST FROM THE USER PAGE OR PROFILE
  asyncThreadFBAPICallToDeleteTheFacebookPost = (post_id) => {
    return new Promise(async (resolve, reject) => {
      this.showProgressBarValue = 0;
      this.fb.api(this.FBAPI + post_id + '?access_token=' + this.currentStreamDetails.access_token, 'delete')
        .then((respo: any) => {
          this.showProgressBarValue = 100;
          console.log(respo);
          resolve(respo);
        })
        .catch((err: any) => {
          console.log(err);
          this.sessionExpiredSOGotoLogin(err);
          this.showProgressBarValue = 100;
          reject(err);
        });
    });
  }
  editFacebookPost = (feedItem: IFBFeedArray) => {
    let editPostObj: { 'postData': IFBFeedArray, 'streams': IFBPages };
    editPostObj = <any>{};
    editPostObj.postData = feedItem;
    editPostObj.streams = this.currentStreamDetails;
    const dialogRef = this.dialog.open(EditFacebookMessage, {
      panelClass: 'app-full-bleed-dialog',
      width: '45vw',
      height: '61vh',
      data: editPostObj,
    });
    this.highLighted = 'show-class';
    dialogRef.afterClosed().subscribe(
      async (result: IStreamComposeData) => {
        if (result && result.composedMessage && result.streamDetails) {
          console.log(result);
          const postDeleteResponse: any = await this.asyncThreadFBAPICallToDeleteTheFacebookPost(result.streamDetails[0].post_id);
          console.log(postDeleteResponse);
          if (postDeleteResponse.success && result.composedMessage.media && result.composedMessage.media.length > 0) {
            const photoUploadResp: IStreamComposeData = await this.addPhotosToFBUserPageOrHomePhotos(result);
            console.log(photoUploadResp);
            const addFBPostResp: any[] = await this.asyncThreadToAddFacebookPost(photoUploadResp);
            console.log(addFBPostResp);
            if (addFBPostResp[0].postStatus) {
              this.alertService.success('Post has been Updated successfully.');
            } else {
              this.alertService.danger('post update failed. Please try again...');
            }
            this.showProgressBarValue = 100;
            this.refreshAllCurrentStreams(result.streamDetails);
            if (addFBPostResp.length === result.streamDetails.length) {
              this.deleteuploadedImagesFromServer(result.composedMessage.media);
            } else {
              console.log('error in facebook component handlecomposedPost');
              this.alertService.danger('Failed to publish the post. Try Again...');
              alert('failed to post the Post.');
            }
          } else {
            if (postDeleteResponse.success) {
              const Updateresult: any = await this.asyncFBAPICALLThreadToPostTheFBPost(result.streamDetails[0], result.composedMessage);
              if (Updateresult.postStatus) {
                this.alertService.success('Post has beed updated successfully');
                this.refreshAllCurrentStreams(result.streamDetails);
              } else {
                this.alertService.danger('post update failed. Please try again...');
              }
            } else {
              this.alertService.danger('post update failed. Please try again...');
            }
          }
        }
      });
  }
  /**
   * THE FOLLOWING METHODS ARE ALL CALLING FROM THE DEFINED METHODS AND WHICH RETURNS EXPECTED DATA TO THE CALLING METHOS.
   */
  // THIS FUNCTION IS USED TO PREPARE THE OBJECT WITH REQUIRED PARAMETERS FOR FB POST
  prepareFBPostObject = (post: IStreamDetails, fbPost: IComposePost): any => {
    const isScheduled: boolean = (fbPost.from_date && fbPost.to_date) ? true : false;
    if (fbPost.media && fbPost.media.length > 0) {
      // tslint:disable-next-line:max-line-length
      let prepareFBPostParamsObject: { 'scheduled_publish_time': any, 'published': boolean, 'attached_media': any[], 'link': any, 'message': string, 'tags': any };
      prepareFBPostParamsObject = <any>{};
      let imgIDsObj: { 'media_fbid': string };
      const imgIDsArray = [];
      _.each(post.imageUploadSuccessItem, (id) => {
        imgIDsObj = <any>{};
        imgIDsObj.media_fbid = id;
        imgIDsArray.push(imgIDsObj);
      });
      prepareFBPostParamsObject.attached_media = imgIDsArray;
      if (fbPost.link) {
        prepareFBPostParamsObject.link = fbPost.link;
      }
      if (fbPost.message) {
        prepareFBPostParamsObject.message = fbPost.message;
      }
      if (isScheduled) {
        prepareFBPostParamsObject.scheduled_publish_time = (moment(fbPost.from_date).valueOf() / 1000);
      }
      prepareFBPostParamsObject.published = !isScheduled;
      return prepareFBPostParamsObject;
    } else {
      let prepareFBPostParamsObject: { 'scheduled_publish_time': any, 'published': boolean, 'link': any, 'message': string, 'tags': any };
      prepareFBPostParamsObject = <any>{};
      if (fbPost.link) {
        prepareFBPostParamsObject.link = fbPost.link;
      }
      if (fbPost.message) {
        prepareFBPostParamsObject.message = fbPost.message;
      }
      if (isScheduled) {
        prepareFBPostParamsObject.scheduled_publish_time = (moment(fbPost.from_date).valueOf() / 1000);
      }
      prepareFBPostParamsObject.published = !isScheduled;
      return prepareFBPostParamsObject;
    }
  }
  // THIS FUNCTION IS USED TO PREPARE THE COMMENT OBJECT TO COMMENT THE FB POST
  prepareCommentObject = (stream, commentObj) => {
    if (commentObj.media && commentObj.media.length > 0 && stream.imageUploadSuccessItem.length > 0) {
      let prepareFBPostParamsObject: { 'attachment_id': string, 'message': string };
      prepareFBPostParamsObject = <any>{};
      prepareFBPostParamsObject.message = commentObj.message;
      prepareFBPostParamsObject.attachment_id = stream.imageUploadSuccessItem[0];
      return prepareFBPostParamsObject;
    } else {
      let prepareFBPostParamsObject: { 'message': string };
      prepareFBPostParamsObject = <any>{};
      prepareFBPostParamsObject.message = commentObj.message;
      return prepareFBPostParamsObject;
    }
  }
  // THIS FUNCTION IS USED TO DELETE THE UPLOADED IMAGES FROM OUR SERVER AFTER POST SUBMITED SUCCESSFULLY
  deleteuploadedImagesFromServer = (imageURL: any[]) => {
    const formData = new FormData();
    formData.append('client_id', AppConstants.CLIENT_ID);
    imageURL.map(urls => {
      formData.append('path[]', urls);
    });
    this.httpClient.post(AppConstants.API_URL + 'flujo_client_deletesocialimageupload', formData).subscribe(
      successresp => {
        console.log();
      }, errorrsp => {
        console.log(errorrsp);
      }
    );
  }
  // THIS FUNCTION IS USED TO HANDLE FACEBOOK ACCESSTOKEN EXPIRE ERROR
  sessionExpiredSOGotoLogin = (errData: IFBError) => {
    console.log(errData);
    if (errData && errData.code === 190 && this.tabIndex === '0') {
      this.FbLongLivedToken = null;
      // this.fbCMPCommunicationService.fbLoginConfirmCall(true);
      // this.router.navigate(['admin/social_login']);
      alert('facebook session expired, Please login with your Facebook');
    }
  }
  // THIS METHOD IS USED TO LOGIN INTO THE FACEBOOK BY ANOOUNCEING THE REQUEST TO SOCIAL COMPONENT
  announceLoginCallToSocialManagementComponent = () => {
    this.fbCMPCommunicationService.fbLoginConfirmCall(true);
  }
}



/*
getting page tagged details
 // 2248386528720687/tagged?fields=actions,full_picture,message,created_time,shares,comments.summary(true),likes.summary(true)&limit=25

// post the share on pageis the following link

  // 964338043669329/feed?link=https://www.facebook.com/1275175529252244

// get tagged person details
  588578604678642?fields=fan_count,description,link,name,category,birthday,hometown
 */
