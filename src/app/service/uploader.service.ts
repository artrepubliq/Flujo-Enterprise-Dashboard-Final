import { Injectable } from '@angular/core';
import {
  HttpClient, HttpEvent, HttpEventType, HttpProgressEvent,
  HttpRequest, HttpErrorResponse, HttpResponse, HttpHeaders
} from '@angular/common/http';

import { of } from 'rxjs/observable/of';
import { catchError, last, map, tap } from 'rxjs/operators';
import { MessageService } from './message.services';
import { AppConstants } from '../app.constants';
@Injectable()
export class UploaderService {
  constructor(
    private http: HttpClient,
    private messenger: MessageService, public messageService: MessageService) {}
 
  upload(files: FileList) {

    if (!files) { return; }

        const req = new HttpRequest('POST', AppConstants.SOCEKT_API_URL+ '/uploadfile', files, {
            reportProgress: true,
      });
    return this.http.request(req).pipe(
      map((event) => this.getEventMessage(event, files)),
      tap(message => this.showProgress(message)),
      last(), // return last (completed) message to caller
      catchError(this.handleError(files))
    )
  }

  /** Return distinct message for sent, upload progress, & response events */
  private getEventMessage(event: HttpEvent<any>, files: FileList) {

    switch (event.type) {

      case HttpEventType.UploadProgress:
        const percentDone = Math.round(100 * event.loaded / event.total);
        return `${percentDone}`;
        
        // case HttpEventType.Sent:
        // return `Uploading file "${files}" of size ${files}.`;

        case HttpEventType.Response:
        return event.body[0];

        default:
        return `File upload event: ${event.type}.`;
    }
  }

  /**
   * Returns a function that handles Http upload failures.
   * @param file - File object for file being uploaded
   *
   * When no `UploadInterceptor` and no server,
   * you'll end up here in the error handler.
   */
  private handleError(file: FileList) {
    const userMessage = `${file} upload failed.`;

    return (error: HttpErrorResponse) => {
      // TODO: send the error to remote logging infrastructure
      console.log(error); // log to console instead

      const message = (error.error instanceof Error) ?
        error.error.message :
       `server returned code ${error.status} with body "${error.error}"`;

      this.messenger.add(`${userMessage} ${message}`);

      // Let app keep running but indicate failure.
      return of(userMessage);
    };
  }

  private showProgress(message: string) {
    this.messenger.add(message);
  }
}