import { AppConstants } from '../app.constants';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICommonInterface } from '../model/commonInterface.model';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class GalleryImagesService {

    requestUrl: string;
    constructor(private httpClient: HttpClient) {

    }
    public getGalleryImagesComponent (request_url: string, client_id: string): Observable<ICommonInterface> {
        return this.httpClient.get<ICommonInterface>(AppConstants.API_URL + request_url + client_id);
    }
}
