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
import { IFBPages, IProfile, IFBPagesList, IMediaData, IFBFeedArray, IFBFeedResponse, IPaginigCursors } from '../model/facebook.model';
@Component({
  selector: 'app-facebook',
  templateUrl: './facebook.component.html',
  styleUrls: ['./facebook.component.scss', '../social-management/social-management.component.scss']
})
export class FacebookComponent implements OnInit {
  displayTextOnlyForHomeTimeline =  false;
  displayTextOnlyForMyPosts =  false;
  displayTextOnlyForTaggedPosts =  false;
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
  userAccountId: string;
  constructor(public dialog: MatDialog, private fbService: FBService,
    private httpClient: HttpClient,
    private fb: FacebookService, private fbCMPCommunicationService: FacebookComponentCommunicationService) {
    this.subscription = fbCMPCommunicationService.SoailAddStreamAnnounced$.subscribe(
      fbAccountsData => {
        this.openAddSocialStreamsDialog(fbAccountsData);
      });
    this.subscription = fbCMPCommunicationService.FBSocialComposedPost$.subscribe(
      fbComposedPost => {
        this.handleComposedFBPost(fbComposedPost);
      });
  }

  ngOnInit() {
    if (this.FbLongLivedToken.length > 0) {
      this.startWithFacebook(this.FbLongLivedToken);
    }
  }
  startWithFacebook = async (FbLongLivedToken) => {
    const profile: any = await this.getUserProfile(FbLongLivedToken);
    this.currentStreamDetails = profile;
    this.getUserHomeORPageTimeline(profile);
    this.getUserHomeORPageMyPosts(profile);
    this.getUserHomeORPageTaggedPosts(profile);
  }

  scrollLoadMoreToRefresh = async (event) => {
    if (event === 1 && this.FBHomeTimelineNextPostURL) {
      const result: IFBFeedResponse = await this.FBAPICallOnLoadMoreRefreshedDataFromFB(this.FBHomeTimelineNextPostURL);
      if (result.paging && result.paging.next) {
      this.FBHomeTimelineNextPostURL = result.paging.next;
      }
      this.FBHomeTimelinePosts = [...this.FBHomeTimelinePosts, ...result.data];
    } else if (event === 2 && this.FBTaggedPostsNextURL) {
     const result: IFBFeedResponse = await this.FBAPICallOnLoadMoreRefreshedDataFromFB(this.FBTaggedPostsNextURL);
     if (result.paging && result.paging.next) {
      this.FBTaggedPostsNextURL = result.paging.next;
     }
     this.FBTaggedPosts = [...this.FBTaggedPosts, ...result.data];
    } else if (event === 3 && this.FBMyPostsNextURL) {
    const result: IFBFeedResponse = await this.FBAPICallOnLoadMoreRefreshedDataFromFB(this.FBMyPostsNextURL);
    if (result.paging && result.paging.next) {
    this.FBMyPostsNextURL = result.paging.next;
  }
    this.FBMyPosts = [...this.FBMyPosts, ...result.data];
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
          console.log('The dialog was closed');
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
        this.getUserPageProfile(result);
        this.getUserHomeORPageTimeline(result);
        this.getUserHomeORPageMyPosts(result);
        this.getUserHomeORPageTaggedPosts(result);
      }
      this.highLighted = 'hide-class';
    });
  }
  getUserProfile = (FbLongLivedToken) => {
    return new Promise((resolve, reject) => {
      // tslint:disable-next-line:max-line-length
      this.fb.api('https://graph.facebook.com/v3.0/me?fields=id,name,picture{url}&access_token=' + FbLongLivedToken, 'get')
        .then((profile_res: IProfile) => {
          this.ProfileData = profile_res;
          this.userAccountId = profile_res.id;
          let useraccount: IFBPages;
          useraccount = <IFBPages>{};
          useraccount.access_token = FbLongLivedToken;
          useraccount.id = profile_res.id;
          useraccount.name = profile_res.name;

          resolve(useraccount);
        })
        .catch((errResp: any) => {
          console.log(errResp);
          reject(errResp);
        });
    });
  }
  getUserPageProfile = (streamDetails: IFBPages) => {
      // tslint:disable-next-line:max-line-length
      this.fb.api('https://graph.facebook.com/v3.0/' + streamDetails.id + '?fields=id,name,picture{url}&access_token=' + streamDetails.access_token, 'get')
        .then((profile_res: IProfile) => {
          this.ProfileData = profile_res;
        })
        .catch((errResp: any) => {
          console.log(errResp);
        });
  }
  // THIS FUNCTION IS FOR GETTING THE ENTER KEY EVENT FOR COMMENT INPUT
  onKeydown = (event, post: IFBFeedArray) => {
    if (event.key === 'Enter') {
      this.postCommentForAUserPagePost(post);
    }
  }

  // THIS FUNCTION IS USED FOR GETTING THE LOAD MORE REFRESHED DATA
  FBAPICallOnLoadMoreRefreshedDataFromFB = (url: any): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.fb.api(url, 'get')
      .then((data: IFBFeedResponse) => {
       resolve(data);
      })
      .catch((errResp: any) => {
        reject(errResp);
      });
    });
  }

  // THIS FUNCTION IS USED TO GET ALL THE HOME FEED IF THE USER
  getUserHomeORPageTimeline = (streamDetails: IFBPages) => {
    // tslint:disable-next-line:max-line-length
    this.fb.api('https://graph.facebook.com/v3.0/' + streamDetails.id + '/feed?fields=parent_id,created_time,description,full_picture,attachments{subattachments},message,shares,comments.summary(true),likes.summary(true)&limit=25&access_token=' + streamDetails.access_token, 'get')
      .then((userHomeFeed: IFBFeedResponse) => {
        this.FBHomeTimelinePosts = userHomeFeed.data;
        if (userHomeFeed && userHomeFeed.paging && userHomeFeed.paging.next) {
          this.FBHomeTimelineNextPostURL = userHomeFeed.paging.next;
        }
      })
      .catch((e: any) => {
        console.log(e);
      });
  }
  // THIS FUNCTION IS USED TO GET TAGGED POST FROM THE USER HOME PROFILE
  getUserHomeORPageTaggedPosts = (streamDetails: IFBPages) => {
    // tslint:disable-next-line:max-line-length
    this.fb.api('https://graph.facebook.com/v3.0/' + streamDetails.id + '/tagged?fields=parent_id,full_picture,message,created_time,shares,comments.summary(true),likes.summary(true)&limit=25&access_token=' + streamDetails.access_token, 'get')
      .then((taggedPosts: IFBFeedResponse) => {
        this.FBTaggedPosts = taggedPosts.data;
        if (taggedPosts && taggedPosts.paging && taggedPosts.paging.next) {
        this.FBTaggedPostsNextURL = taggedPosts.paging.next;
        }
      })
      .catch((e: any) => {
        console.log(e);

      });
  }
  // THIS FUNCTION IS USED TO GET SHARED POST FROM THE USER HOME PROFILE
  getUserHomeORPageMyPosts = (streamDetails: IFBPages) => {
    // tslint:disable-next-line:max-line-length
    this.fb.api('https://graph.facebook.com/v3.0/' + streamDetails.id + '/feed?fields=parent_id,created_time,description,full_picture,message,shares,comments.summary(true),likes.summary(true)&limit=25&access_token=' + streamDetails.access_token, 'get')
      .then((myPost: IFBFeedResponse) => {
        if (myPost && myPost.paging && myPost.paging.next) {
        this.FBMyPostsNextURL = myPost.paging.next;
        }
        const filteredmyPost: IFBFeedArray[] = _.filter(myPost.data, (object) => {
          return !object.parent_id;
        });
        this.FBMyPosts = filteredmyPost;
      })
      .catch((e: any) => {
        console.log(e);

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
  // THIS FUNCTION IS USED TO POST THE LIKE FOR FACEBOOK PAGE POST
  postLikeForAUserPagePost = (post: IFBFeedArray) => {
    this.fb.api('https://graph.facebook.com/v3.0/' + post.id + '/likes?access_token=' + this.currentStreamDetails.access_token, 'post')
      .then((res: any) => {
        console.log('post like response');
        console.log(res);
      })
      .catch((e: any) => {
        console.log(e);
      });
  }
  // THIS FUNCTION IS USED TO POST THE COMMENT FOR FACEBOOK PAGE POST
  postCommentForAUserPagePost = (post: IFBFeedArray) => {
    let commentinput: {'message': string};
    commentinput = <any>{};
    commentinput.message = this.commentInput;
    this.fb.api('https://graph.facebook.com/' + post.id + '/comments?access_token=' + this.currentStreamDetails.access_token,
      'post', commentinput)
      .then((respo: any) => {
        this.commentInput = '';
        console.log(respo);
      })
      .catch((err: Error) => {
        console.log(err);
      });
  }

  // THIS FUNCTION IS USED TO  SHARE THE FACEBOOK POST FROM THE PAGE
  postShareAUserPagePost = (post: IFBFeedArray) => {
    const postID = post.id.split('_');
    // tslint:disable-next-line:max-line-length
    this.fb.api('https://graph.facebook.com/v3.0/' + postID[0] + '/feed?link=https://www.facebook.com/' + postID[1] + '&access_token=' + this.currentStreamDetails.access_token, 'post')
      .then((res: any) => {
        console.log('share response');
        console.log(res.data);
      })
      .catch((e: any) => {
        console.log(e);
      });
  }
  // THIS FUNCTION IS USED TO HANDLE ALL THE FUNCTIONALITIES REQUIRED TO POST THE FB POST
  handleComposedFBPost = async (composedFBPost: IStreamComposeData) => {
    console.log(composedFBPost);
    try {
      const photoUploadResp = await this.addPhotosToFBUserPageOrHomePhotos(composedFBPost);
      console.log(photoUploadResp);
      const addFBPostResp: any[] = await this.asyncThreadToAddFacebookPost(photoUploadResp);
      console.log(addFBPostResp);
      if (addFBPostResp.length === composedFBPost.streamDetails.length) {
        this.deleteuploadedImagesFromServer(composedFBPost.composedMessage.media);
      } else {
        console.log('error in facebook component handlecomposedPost');
        alert('failed to post the Post on Some streams');
      }
    } catch (err) {
      console.log(err);
    }

  }
  // THIS FUNCTION IS USED TO POST THE FB POST IN ALL THE SELECTED STREAMS
  asyncThreadToAddFacebookPost = (fbPost: IStreamComposeData): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      try {
        const fbImgUploadResp = await fbPost.streamDetails.reduce((promise, streamItem, index) =>
          promise.then(async (arr) => [...arr, await this.asyncFBAPICALLThreadToPostTheFBPost(streamItem, fbPost.composedMessage)]),
          Promise.resolve([]));
        console.log(fbImgUploadResp);
        resolve(fbImgUploadResp);
      } catch (url) {
        console.log('something went wrong');
        alert('something went wrong. please try again.');
      }
    });
  }
  // THIS FACEBOOK API CALL SERVICE TO POST THE FB POST ON TO SELECTED PAGE OR PROFILE
  asyncFBAPICALLThreadToPostTheFBPost = (streamItem: IStreamDetails, composedPost: IComposePost) => {
    return new Promise(async (resolve, reject) => {
      if (streamItem.imageUploadFailedItem.length === 0 && streamItem.imageUploadSuccessItem.length > 0) {
        const fbPostObject = this.prepareFBPostObject(streamItem, composedPost);
        // prepareFBPostParamsObject.tags =
        this.fb.api('https://graph.facebook.com/v3.0/' + streamItem.social_id + '/feed?access_token=' + streamItem.access_token,
          'post', fbPostObject)
          .then((respo: any) => {
            streamItem.postStatus = true;
            resolve(streamItem);
          })
          .catch((err: Error) => {
            console.log(err);
            streamItem.postStatus = false;
            reject(streamItem);
          });
      } else {
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
          alert('something went wrong. please try again.');
        }
      }
    });
  }
  // THIS FUNCTION IS USED TO UPLOAD THE ALL THE IMAGES AND GIVES THE HOLE UPLOAD RESPONSE BACK.
  asyncThreadToUploadTheImagesToFB = async (mediaUrls, streamItem: IStreamDetails) => {
    return new Promise(async (resolve, reject) => {
      let fbImgUploadResp: IStreamDetails;
      try {
        fbImgUploadResp = await mediaUrls.reduce((promise, urlItem, index) =>
          promise.then(async (arr) => [...arr, await this.APICallToUploadLocalPhotosToFacebook(streamItem, urlItem)]), Promise.resolve([]));
        console.log(fbImgUploadResp);
        resolve(fbImgUploadResp[0]);
      } catch (url) {
        console.log('something went wrong');
        alert('something went wrong. please try again.');
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
      this.fb.api('https://graph.facebook.com/v3.0/' + streamItem.social_id + '/photos?access_token=' + streamItem.access_token,
        'post', photoObject)
        .then((fbPhotoId: any) => {
          streamItem.imageUploadSuccessItem.push(fbPhotoId.id);
          resolve(streamItem);
        })
        .catch((err: Error) => {
          streamItem.imageUploadSuccessItem.push(urlItem);
          resolve(streamItem);
        });
    });
  }
  // FUNCTION IS USED TO DELETE THE FACEBOOK POST FROM THE USER PAGE OR PROFILE
  deleteFBPostFromUserHomeOrPageTimeline = (postDetails: IFBFeedArray, currentStreamDetails: IFBPages, streamSNo) => {
    this.fb.api('https://graph.facebook.com/v3.0/' + postDetails.id + '?access_token=' + currentStreamDetails.access_token, 'delete')
      .then((respo: any) => {
        if (streamSNo === 1) {
          this.getUserHomeORPageTimeline(currentStreamDetails);
        } else if (streamSNo === 2) {
          this.getUserHomeORPageTaggedPosts(currentStreamDetails);
        } else {
          this.getUserHomeORPageMyPosts(currentStreamDetails);
        }
        console.log(respo);
      })
      .catch((err: Error) => {
        console.log(err);
      });
  }

  editFacebookPost = (feedItem: IFBFeedArray, currentStreamDetails: IFBPages) => {
    let editPostObj: {'postData': IFBFeedArray, 'streams': IFBPages};
    editPostObj = <any>{};
    editPostObj.postData = feedItem;
    editPostObj.streams = currentStreamDetails;
      const dialogRef = this.dialog.open(EditFacebookMessage, {
        panelClass: 'app-full-bleed-dialog',
        width: '45vw',
        height: '61vh',
        data: editPostObj,
      });
      this.highLighted = 'show-class';
      dialogRef.afterClosed().subscribe((result: any) => {
        console.log(result);
      });
  }
  /**
   * THE FOLLOWING METHODS ARE ALL CALLING FROM THE DEFINED METHODS AND WHICH RETURNS EXPECTED DATA TO THE CALLING METHOS.
   */
  // THIS FUNCTION IS USED TO PREPARE THE OBJECT WITH REQUIRED PARAMETERS FOR FB POST
  prepareFBPostObject = (post: IStreamDetails, fbPost: IComposePost): any => {
    let prepareFBPostParamsObject: { 'attached_media': any[], 'link': any, 'message': string, 'tags': any };
    prepareFBPostParamsObject = <any>{};
    let imgIDsObj: { 'media_fbid': string };
    const imgIDsArray = [];
    _.each(post.imageUploadSuccessItem, (id) => {
      imgIDsObj = <any>{};
      imgIDsObj.media_fbid = id;
      imgIDsArray.push(imgIDsObj);
    });
    prepareFBPostParamsObject.attached_media = imgIDsArray;
    prepareFBPostParamsObject.link = fbPost.link;
    prepareFBPostParamsObject.message = fbPost.message;
    return prepareFBPostParamsObject;
  }

  // THIS FUNCTION IS USED TO DELETE THE UPLOADED IMAGES FROM OUR SERVER AFTER POST SUBMITED SUCCESSFULLY
  deleteuploadedImagesFromServer = (imageURL: any[]) => {
    const formData = new FormData();
    formData.append('client_id', AppConstants.CLIENT_ID);
    imageURL.map(urls => {
      formData.append('path[]', urls);
    });
    this.httpClient.post('http://flujo.in/dashboard/flujo_staging/flujo_client_deletesocialimageupload', formData).subscribe(
      successresp => {
        console.log();
      }, errorrsp => {
        console.log(errorrsp);
      }
    );
  }

}



/*
getting page tagged details
 // 2248386528720687/tagged?fields=actions,full_picture,message,created_time,shares,comments.summary(true),likes.summary(true)&limit=25

// post the share on pageis the following link

  // 964338043669329/feed?link=https://www.facebook.com/1275175529252244
 */
