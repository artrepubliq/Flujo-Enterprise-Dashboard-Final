import { AppConstants } from '../app.constants';
import { IHttpResponse } from '../model/httpresponse.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { mediaDetail } from '../model/feedback.model';
import { Injectable } from '@angular/core';
@Injectable()
export class GalleryImagesService {

    requestUrl: string;
    constructor(private httpClient: HttpClient) {

    }
    getGalleryImagesComponent = (requestUrl, CLIENT_ID) => {
        return this.httpClient.get<Array<mediaDetail>>(AppConstants.API_URL + requestUrl + CLIENT_ID);
    }
}
